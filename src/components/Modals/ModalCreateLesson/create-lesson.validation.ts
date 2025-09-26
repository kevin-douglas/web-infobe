import { z } from 'zod';

export const CreateLessonForm = z.object({
  name: z
    .string()
    .min(1, 'Nome do aula é obrigatório')
    .min(5, 'Nome do aula deve ter pelo menos 5 caracteres'),
  description: z
    .object({
      root: z.object({
        children: z.array(z.any()), // estrutura do Lexical pode variar
        type: z.string(),
        direction: z.string().nullable(),
        format: z.string(),
        indent: z.number(),
        version: z.number(),
      }),
    })
    .refine(
      (val) => {
        // valida se tem pelo menos 15 caracteres no texto plano
        const textContent = JSON.stringify(val); // ou use seu parser para extrair texto
        return textContent.replace(/[^a-zA-Z0-9À-ú]/g, '').length >= 15;
      },
      { message: 'Descrição da aula deve ter pelo menos 15 caracteres' },
    ),
});

export type CreateLessonFormSchema = z.infer<typeof CreateLessonForm>;
