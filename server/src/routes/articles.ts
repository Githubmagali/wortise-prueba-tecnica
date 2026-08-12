import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/require-auth.js";
import { createArticleSchema, paginationSchema, updateArticleSchema } from "../schemas.js";
import { slugify } from "../lib/slugify.js";

const articles = new Hono();

articles.use("*", requireAuth);

articles.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = createArticleSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Datos inválidos", details: parsed.error.flatten() }, 400);
  }
  const db = await getDb();
  const article = {
    title: parsed.data.title,
    slug: slugify(parsed.data.title),
    content: parsed.data.content,
    coverImageUrl: parsed.data.coverImageUrl ?? null,
    authorId: c.get("user").id,
    authorName: c.get("user").name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("articles").insertOne(article);
  return c.json({ item: serializeArticle({ ...article, _id: result.insertedId }) }, 201);
});

articles.get("/", async (c) => {
  const parsed = paginationSchema.safeParse(c.req.query());
  if (!parsed.success) {
    return c.json({ error: "Parámetros de paginación inválidos", details: parsed.error.flatten() }, 400);
  }
  const { page, limit } = parsed.data;
  const db = await getDb();
  const filter = { authorId: c.get("user").id };

  const [items, total] = await Promise.all([
    db
      .collection("articles")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    db.collection("articles").countDocuments(filter),
  ]);

  return c.json({
    items: items.map(serializeArticle),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});

articles.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Id inválido" }, 400);
  }

  const db = await getDb();
  const article = await db.collection("articles").findOne({ _id: new ObjectId(id) });

  if (!article) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }

  if (article.authorId !== c.get("user").id) {
    return c.json({ error: "No tenés permiso para ver este artículo" }, 403);
  }

  return c.json({ item: serializeArticle(article) });
});

articles.put("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Id inválido" }, 400);
  }

  const body = await c.req.json().catch(() => null);
  const parsed = updateArticleSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Datos inválidos", details: parsed.error.flatten() }, 400);
  }

  const db = await getDb();
  const collection = db.collection("articles");

  const existing = await collection.findOne({ _id: new ObjectId(id) });
  if (!existing) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }
  if (existing.authorId !== c.get("user").id) {
    return c.json({ error: "No tenés permiso para editar este artículo" }, 403);
  }

  const update = {
    title: parsed.data.title,
    content: parsed.data.content,
    coverImageUrl: parsed.data.coverImageUrl ?? null,
    updatedAt: new Date(),
  };

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
  const updated = await collection.findOne({ _id: new ObjectId(id) });

  return c.json({ item: serializeArticle(updated!) });
});

articles.delete("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Id inválido" }, 400);
  }

  const db = await getDb();
  const collection = db.collection("articles");

  const existing = await collection.findOne({ _id: new ObjectId(id) });
  if (!existing) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }
  if (existing.authorId !== c.get("user").id) {
    return c.json({ error: "No tenés permiso para eliminar este artículo" }, 403);
  }

  await collection.deleteOne({ _id: new ObjectId(id) });
  return c.json({ ok: true });
});

function serializeArticle(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    coverImageUrl: doc.coverImageUrl,
    authorId: doc.authorId,
    authorName: doc.authorName,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default articles;