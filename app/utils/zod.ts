import { z } from "zod";

export const registrationSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Ingresa un usuario por lo menos 5 caracteres" }),
  email: z.string().email({ message: "Ingresa un email valido" }),
  password: z
    .string()
    .min(5, { message: "Ingresa un password de por lo menos 5 caracteres" }),
});

export type TRegistration = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo valido" }),
  password: z.string(),
});

export const emailSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo valido" }),
});

export const codeSchema = z.object({
  code: z.string().min(5, { message: "Ingresa un codigo valido" }),
  password: z
    .string()
    .min(5, { message: "Ingresa una password de al menos 5 characteres" }),
});

export const createCourseSchema = z.object({
  name: z.string().min(2, { message: "El nombre de curso es obligatorio" }),
  description: z
    .string()
    .min(2, { message: "La descripcion debe ser mas especifica" }),
  price: z.string().min(1, { message: "Define un precio" }),
  paid: z.string(),
  imagePreview: z.string(),
});
