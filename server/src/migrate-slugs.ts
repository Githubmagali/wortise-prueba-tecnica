import "dotenv/config";
import { getDb, mongoClient } from "./db.js";
import { slugify } from "./lib/slugify.js";

async function migrate() {
  const db = await getDb();
  const collection = db.collection("articles");

  const articlesWithoutSlug = await collection.find({ slug: { $exists: false } }).toArray();

  console.log(`Encontrados ${articlesWithoutSlug.length} artículos sin slug.`);

  for (const article of articlesWithoutSlug) {
    const slug = slugify(article.title);
    await collection.updateOne({ _id: article._id }, { $set: { slug } });
    console.log(`  ✓ "${article.title}" → slug: "${slug}"`);
  }

  console.log("\nMigración completada.");
  await mongoClient.close();
  process.exit(0);
}

migrate().catch((error) => {
  console.error("Error corriendo la migración:", error);
  process.exit(1);
});