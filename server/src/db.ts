import { MongoClient, type Db } from "mongodb";


const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!dbName) {
  throw new Error("MONGODB_DB_NAME is not defined in environment variables");
}

export const mongoClient = new MongoClient(uri);

let db: Db | null = null;

export async function getDb(): Promise<Db> { 

  if (db) return db;

  await mongoClient.connect();
  db = mongoClient.db(dbName);

  //Indice para optimizar la búsqueda de artículos por autor y ordenados por fecha de creación
  await db.collection("articles").createIndex({ authorId: 1, createdAt: -1 });


  return db;
}

