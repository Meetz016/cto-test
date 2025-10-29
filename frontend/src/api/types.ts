export interface Todo {
  id: string
  title: string
  description?: string | null
  completed: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export interface TodoCreateInput {
  title: string
  description?: string
}

export type TodoUpdateInput = Partial<Omit<Todo, 'id'>>
