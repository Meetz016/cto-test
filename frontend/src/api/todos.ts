import { request } from './client'
import type { Todo, TodoCreateInput, TodoUpdateInput } from './types'

export const todosApi = {
  list: () => request<Todo[]>('/todos'),
  create: (payload: TodoCreateInput) =>
    request<Todo>('/todos', {
      method: 'POST',
      body: payload,
    }),
  update: (id: string, payload: TodoUpdateInput) =>
    request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: payload,
    }),
  remove: (id: string) =>
    request<void>(`/todos/${id}`, {
      method: 'DELETE',
    }),
}
