import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import {
  createTodo,
  deleteTodo,
  listTodos,
  toggleTodoCompletion,
  updateTodo,
} from '../services/todoService';
import { ApiError } from '../utils/errors';
import {
  CreateTodoInput,
  TodoIdParams,
  UpdateTodoInput,
  createTodoSchema,
  todoIdParamSchema,
  updateTodoSchema,
} from '../validators/todoValidators';

const parseBody = <T>(schema: ZodSchema<T>, data: unknown, next: NextFunction): T | undefined => {
  const result = schema.safeParse(data);

  if (!result.success) {
    next(new ApiError(400, 'Invalid request payload', result.error.flatten()));
    return undefined;
  }

  return result.data;
};

const parseParams = (
  schema: ZodSchema<TodoIdParams>,
  params: unknown,
  next: NextFunction,
): TodoIdParams | undefined => {
  const result = schema.safeParse(params);

  if (!result.success) {
    next(new ApiError(400, 'Invalid route parameters', result.error.flatten()));
    return undefined;
  }

  return result.data;
};

/**
 * Returns all todos ordered from newest to oldest.
 */
export const handleListTodos = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await listTodos();
    res.status(200).json({ data: todos });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new todo item using the provided payload.
 */
export const handleCreateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseBody<CreateTodoInput>(createTodoSchema, req.body, next);

    if (!payload) {
      return;
    }

    const todo = await createTodo(payload);
    res.status(201).json({ data: todo });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a todo item identified by the route parameter.
 */
export const handleUpdateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = parseParams(todoIdParamSchema, req.params, next);

    if (!params) {
      return;
    }

    const payload = parseBody<UpdateTodoInput>(updateTodoSchema, req.body, next);

    if (!payload) {
      return;
    }

    const updated = await updateTodo(params.id, payload);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggles the completion status of a todo item.
 */
export const handleToggleTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = parseParams(todoIdParamSchema, req.params, next);

    if (!params) {
      return;
    }

    const toggled = await toggleTodoCompletion(params.id);
    res.status(200).json({ data: toggled });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes the todo item identified by the route parameter.
 */
export const handleDeleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = parseParams(todoIdParamSchema, req.params, next);

    if (!params) {
      return;
    }

    const deleted = await deleteTodo(params.id);
    res.status(200).json({ data: { id: deleted.id } });
  } catch (error) {
    next(error);
  }
};
