import type { Todo, TodoUpdateInput } from '../../../api/types'
import { TodoItem } from './TodoItem'

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => Promise<unknown>
  onUpdate: (id: string, input: TodoUpdateInput) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

export const TodoList = ({ todos, onToggle, onUpdate, onDelete }: TodoListProps) => {
  if (!todos.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M9 11.25H7.5v1.5H9v-1.5Zm3.75 0h-1.5v1.5h1.5v-1.5Zm3.75 0h-1.5v1.5h1.5v-1.5Z" />
            <path
              fillRule="evenodd"
              d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18V6.75Zm2.25-.75a.75.75 0 0 0-.75.75V18c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75V6.75a.75.75 0 0 0-.75-.75H6.75Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Everything is clear</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          You don’t have any todos yet. Create your first task to get started.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  )
}
