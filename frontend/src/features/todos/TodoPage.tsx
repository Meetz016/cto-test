import { useMemo, useState } from 'react'

import { Spinner } from '../../components/Spinner'
import { useTodos } from '../../hooks/useTodos'
import type { Todo } from '../../api/types'
import { TodoFilters } from './components/TodoFilters'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'

type FilterValue = 'all' | 'active' | 'completed'

const filterTodos = (todos: Todo[], filter: FilterValue) => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed)
    case 'completed':
      return todos.filter((todo) => todo.completed)
    default:
      return todos
  }
}

export const TodoPage = () => {
  const [filter, setFilter] = useState<FilterValue>('all')
  const {
    todos,
    isLoading,
    isError,
    error,
    isFetching,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    isCreating,
    refetch,
  } = useTodos()

  const counts = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length
    const active = todos.length - completed
    return {
      total: todos.length,
      active,
      completed,
    }
  }, [todos])

  const filteredTodos = useMemo(() => filterTodos(todos, filter), [todos, filter])

  const errorMessage = error?.message ?? 'Something went wrong while loading your todos.'

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 lg:px-6">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Todo dashboard</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Track, organise, and complete your tasks. Todos sync automatically with the backend API, including inline editing and instant completion toggles.
          </p>
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
        <aside className="lg:sticky lg:top-10">
          <TodoForm onSubmit={createTodo} isSubmitting={isCreating} />
        </aside>

        <section className="space-y-4 rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TodoFilters value={filter} onChange={setFilter} counts={counts} />

            {isFetching ? (
              <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Spinner size="sm" />
                <span>Refreshing…</span>
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm text-slate-600">
                <Spinner />
                <span>Loading your todos…</span>
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-red-700">
              <h2 className="text-lg font-semibold">Unable to load todos</h2>
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                Try again
              </button>
            </div>
          ) : (
            <TodoList todos={filteredTodos} onToggle={toggleTodo} onUpdate={updateTodo} onDelete={deleteTodo} />
          )}
        </section>
      </div>
    </div>
  )
}
