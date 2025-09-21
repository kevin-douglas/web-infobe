import { z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';

export const SignUpForm = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  tax_identifier: z
    .string()
    .refine((value) => cpf.isValid(value.replace(/\D/g, '')), {
      message: 'CPF inválido',
    }),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .superRefine((value, ctx) => {
      if (!/[A-Z]/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve conter pelo menos uma letra maiúscula',
        });
      }
      if (!/[a-z]/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve conter pelo menos uma letra minúscula',
        });
      }
      if (!/[0-9]/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve conter pelo menos um número',
        });
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve conter pelo menos um caractere especial',
        });
      }
    }),
});

export type SignUpFormSchema = z.infer<typeof SignUpForm>;
