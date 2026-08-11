import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().trim().email("Ingresá un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginFormSchema = z.object({
  email: z.string().trim().email("Ingresá un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().trim().email('Ingresá un email válido'),
})

const resetPasswordSearchSchema = z.object({
  token: z.string().catch(''),
})

export const articleFormSchema = z.object({
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
    .optional(),
});

