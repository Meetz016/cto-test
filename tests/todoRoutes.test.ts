import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import app from '../src/app';
import { disconnectPrisma, prisma } from '../src/utils/prisma';

const TODOS_PATH = '/api/todos';

describe('Todo API', () => {
  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    await disconnectPrisma();
  });

  it('creates a todo item', async () => {
    const response = await request(app).post(TODOS_PATH).send({
      title: 'Write integration tests',
      description: 'Ensure API endpoints behave as expected.',
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      title: 'Write integration tests',
      description: 'Ensure API endpoints behave as expected.',
      completed: false,
    });

    const stored = await prisma.todo.findUnique({ where: { id: response.body.data.id } });
    expect(stored).not.toBeNull();
  });

  it('lists existing todo items', async () => {
    await prisma.todo.createMany({
      data: [
        { title: 'First todo' },
        { title: 'Second todo' },
      ],
    });

    const response = await request(app).get(TODOS_PATH);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty('title');
  });

  it('rejects invalid todo payloads', async () => {
    const response = await request(app).post(TODOS_PATH).send({ title: '' });

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('message', 'Invalid request payload');
    expect(response.body.error.details).toBeDefined();
  });

  it('returns 404 when updating a non-existent todo', async () => {
    const response = await request(app).put(`${TODOS_PATH}/999`).send({ title: 'Updated' });

    expect(response.status).toBe(404);
    expect(response.body.error).toMatchObject({ message: 'Todo not found' });
  });

  it('toggles the completion status of a todo', async () => {
    const created = await request(app).post(TODOS_PATH).send({ title: 'Toggle me' });
    const id = created.body.data.id;

    const toggled = await request(app).patch(`${TODOS_PATH}/${id}/toggle`);

    expect(toggled.status).toBe(200);
    expect(toggled.body.data.completed).toBe(true);

    const toggledAgain = await request(app).patch(`${TODOS_PATH}/${id}/toggle`);
    expect(toggledAgain.body.data.completed).toBe(false);
  });

  it('deletes an existing todo', async () => {
    const created = await request(app).post(TODOS_PATH).send({ title: 'Delete me' });
    const id = created.body.data.id;

    const response = await request(app).delete(`${TODOS_PATH}/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ id });

    const stored = await prisma.todo.findUnique({ where: { id } });
    expect(stored).toBeNull();
  });
});
