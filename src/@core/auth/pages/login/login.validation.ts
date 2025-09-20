import { z } from "zod";

export const LoginForm = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export type LoginFormSchema = z.infer<typeof LoginForm>;
