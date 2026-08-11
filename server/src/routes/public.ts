import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { searchSchema } from "../schemas.js";

const publicRoutes = new Hono();

publicRoutes.get("/authors", async (c) => {
    const db = await getDb();

    const authors = await db
        .collection("articles")
        .aggregate([
            { $group: { _id: "$authorId", authorName: { $first: "$authorName" }, articleCount: { $sum: 1 } } },
            { $sort: { articleCount: -1, authorName: 1 } },
        ])
        .toArray();

    return c.json({
        items: authors.map((a) => ({
            authorId: a._id,
            authorName: a.authorName,
            articleCount: a.articleCount,
        })),
    });
});

publicRoutes.get("/articles/search", async (c) => {
    const parsed = searchSchema.safeParse(c.req.query());
    if (!parsed.success) {
        return c.json({ error: "Parámetros de búsqueda inválidos", details: parsed.error.flatten() }, 400);
    }
    const { q, page, limit } = parsed.data;

    const db = await getDb();
    const collection = db.collection("articles");

    const filter = q
        ? {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
                { authorName: { $regex: q, $options: "i" } },
            ],
        }
        : {};
    const [items, total] = await Promise.all([
        collection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray(),
        collection.countDocuments(filter),
    ]);

    return c.json({
        items: items.map(serializeArticle),
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    });
});

publicRoutes.get("/articles/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Id inválido" }, 400);
  }

  const db = await getDb();
  const article = await db.collection("articles").findOne({ _id: new ObjectId(id) });

  if (!article) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }

  return c.json({ item: serializeArticle(article) });
});

function serializeArticle(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    coverImageUrl: doc.coverImageUrl,
    authorId: doc.authorId,
    authorName: doc.authorName,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default publicRoutes;