import { z } from 'zod';

export const CreateModuleForm = z.object({
  name: z
    .string()
    .min(1, 'Nome do módulo é obrigatório')
    .min(10, 'Nome do módulo deve ter pelo menos 10 caracteres'),
});

export type CreateModuleFormSchema = z.infer<typeof CreateModuleForm>;
