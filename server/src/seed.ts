import "dotenv/config";
import { auth } from "./lib/auth.js";
import { getDb, mongoClient } from "./db.js";

const SEED_USERS = [
  { name: "Melisa", email: "melisa@example.com", password: "password123" },
  { name: "Sebastian", email: "sebastian@example.com", password: "password123" },
];

const SEED_ARTICLES = [
  {
    authorEmail: "melisa@example.com",
    title: "Aumenta los ingresos de tu sitio un 30% con Google Ad Manager",
    content:
      "Google Ad Manager permite a los publishers optimizar sus ingresos publicitarios mediante subastas en tiempo real y reglas de segmentación avanzadas. En este artículo repasamos cómo configurarlo desde cero.",
    coverImageUrl: "https://media.istockphoto.com/id/2098359215/photo/digital-marketing-concept-businessman-using-laptop-with-ads-dashboard-digital-marketing.jpg?s=2048x2048&w=is&k=20&c=enTR0-sMB481lfHGaMcaoiBBY0_uxXDzhLeEbL2mAtk=",
  },
  {
    authorEmail: "melisa@example.com",
    title: "Quiénes somos?",
    content:
      "Nuestra misión es desarrollar innovación que permita integrar y conectar a las marcas, los usuarios y a los desarrolladores de tecnología en un mismo ecosistema.",
    coverImageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    authorEmail: "sebastian@example.com",
    title: "La plataforma de monetización de anuncios con el eCPM más alto",
    content:
      "Hacé crecer tu negocio alcanzando a clientes nuevos y fieles, en sus espacios favoritos: juegos, aplicaciones, herramientas, entre 42 categorías más, pudiendo combinarla con herramientas de hipersegmentación como la ubicación exacta.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
  },
];

async function seed() {
  const db = await getDb();


  const userIdByEmail = new Map<string, string>();

  for (const seedUser of SEED_USERS) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          name: seedUser.name,
          email: seedUser.email,
          password: seedUser.password,
        },
      });
      userIdByEmail.set(seedUser.email, result.user.id);
     
    } catch (error) {
      // Si el usuario ya existe (por correr el seed dos veces), lo buscamos en Mongo directo
      const existing = await db.collection("user").findOne({ email: seedUser.email });
      if (existing) {
        userIdByEmail.set(seedUser.email, existing._id.toString());
        console.log(`  · ${seedUser.name} ya existía, se reutiliza`);
      } else {
        console.error(`  ✗ Error creando a ${seedUser.name}:`, error);
      }
    }
  }


  for (const seedArticle of SEED_ARTICLES) {
    const authorId = userIdByEmail.get(seedArticle.authorEmail);
    const author = SEED_USERS.find((u) => u.email === seedArticle.authorEmail);
    if (!authorId || !author) continue;

    const alreadyExists = await db.collection("articles").findOne({
      title: seedArticle.title,
      authorId,
    });
    if (alreadyExists) {
      console.log(`  · "${seedArticle.title}" ya existía, se omite`);
      continue;
    }

    await db.collection("articles").insertOne({
      title: seedArticle.title,
      content: seedArticle.content,
      coverImageUrl: seedArticle.coverImageUrl || null,
      authorId,
      authorName: author.name,
      createdAt: new Date(),
    });
    console.log(`  ✓ "${seedArticle.title}"`);
  }

  SEED_USERS.forEach((u) => console.log(`  - ${u.email}`));

  await mongoClient.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error corriendo el seed:", error);
  process.exit(1);
});