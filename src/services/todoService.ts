import { Prisma } from '@prisma/client';

import { ApiError } from '../utils/errors';
import { prisma } from '../utils/prisma';
import type { CreateTodoInput, UpdateTodoInput } from '../validators/todoValidators';

const handlePrismaKnownError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    throw new ApiError(404, 'Todo not found');
  }

  throw error;
};

const removeUndefinedValues = <T extends Record<string, unknown>>(input: T): T => {
  const entries = Object.entries(input).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries) as T;
};

export const listTodos = async () => {
  return prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createTodo = async (payload: CreateTodoInput) => {
  const data = removeUndefinedValues(payload);

  return prisma.todo.create({
    data,
  });
};

export const updateTodo = async (id: number, payload: UpdateTodoInput) => {
  const data = removeUndefinedValues(payload);

  try {
    return await prisma.todo.update({
      where: { id },
      data,
    });
  } catch (error) {
    return handlePrismaKnownError(error);
  }
};

export const toggleTodoCompletion = async (id: number) => {
  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo) {
    throw new ApiError(404, 'Todo not found');
  }

  return prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });
};

export const deleteTodo = async (id: number) => {
  try {
    return await prisma.todo.delete({ where: { id } });
  } catch (error) {
    return handlePrismaKnownError(error);
  }
};
