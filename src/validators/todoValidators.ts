import { z } from 'zod';

const titleSchema = z.string().trim().min(1, 'Title is required').max(255);

const descriptionSchema = z
  .string()
  .trim()
  .min(1, 'Description cannot be empty')
  .max(1024);

export const todoIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Id must be a positive integer'),
});

export const createTodoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
});

export const updateTodoSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: 'At least one field must be provided to update a todo',
      path: [],
    },
  );

export type TodoIdParams = z.infer<typeof todoIdParamSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
