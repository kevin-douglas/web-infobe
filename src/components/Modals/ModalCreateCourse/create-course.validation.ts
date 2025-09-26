import { z } from 'zod';

export const CreateCourseForm = z.object({
  course_name: z
    .string()
    .min(1, 'Nome do curso é obrigatório')
    .min(10, 'Nome do curso deve ter pelo menos 10 caracteres'),
  file: z.instanceof(File, { message: 'É necessário selecionar um arquivo' }),
  editable: z.boolean().optional(),
});

export type CreateCourseFormSchema = z.infer<typeof CreateCourseForm>;
