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
