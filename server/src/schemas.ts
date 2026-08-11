import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(150, "El título no puede superar los 150 caracteres"),


content: z
    .string()
    .trim()
    .min(10, "El contenido debe tener al menos 10 caracteres")
    .max(20000, "El contenido no puede superar los 20000 caracteres"),

coverImageUrl: z
    .union([z.string().trim().url("La URL de portada no es válida"), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export const updateArticleSchema = createArticleSchema;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const searchSchema = z.object({
  q: z.string().trim().max(150).optional().default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

