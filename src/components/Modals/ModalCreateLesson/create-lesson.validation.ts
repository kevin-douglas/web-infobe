import { z } from 'zod';

export const CreateLessonForm = z.object({
  name: z
    .string()
    .min(1, 'Nome do aula é obrigatório')
    .min(5, 'Nome do aula deve ter pelo menos 5 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição da aula é obrigatório')
    .min(15, 'Descrição da aula deve ter pelo menos 15 caracteres'),
});

export type CreateLessonFormSchema = z.infer<typeof CreateLessonForm>;
