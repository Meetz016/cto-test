import { useEffect, useMemo, useState } from 'react'

import { ApiError } from '../../../api/client'
import type { Todo, TodoUpdateInput } from '../../../api/types'
import { Spinner } from '../../../components/Spinner'

const formatDate = (value?: string | null) => {
  if (!value) return null

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(value))
  } catch (error) {
    console.warn('[ui] Unable to format date', error)
    return null
  }
}

type TodoItemProps = {
  todo: Todo
  onToggle: (id: string, completed: boolean) => Promise<unknown>
  onUpdate: (id: string, input: TodoUpdateInput) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

export const TodoItem = ({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formState, setFormState] = useState({
    title: todo.title,
    description: todo.description ?? '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditing) {
      setFormState({
        title: todo.title,
        description: todo.description ?? '',
      })
    }
  }, [todo.description, todo.title, isEditing])

  const createdLabel = useMemo(() => formatDate(todo.createdAt), [todo.createdAt])
  const updatedLabel = useMemo(() => formatDate(todo.updatedAt), [todo.updatedAt])

  const disableInteractions = isSaving || isDeleting || isToggling

  const handleToggle = async () => {
    if (disableInteractions) return

    try {
      setErrorMessage(null)
      setIsToggling(true)
      await onToggle(todo.id, !todo.completed)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Unable to update the todo status. Please retry.'
      setErrorMessage(message)
    } finally {
      setIsToggling(false)
    }
  }

  const handleSave = async () => {
    const trimmedTitle = formState.title.trim()
    const trimmedDescription = formState.description.trim()

    if (!trimmedTitle) {
      setErrorMessage('A title is required to save your changes.')
      return
    }

    try {
      setIsSaving(true)
      setErrorMessage(null)
      await onUpdate(todo.id, {
        title: trimmedTitle,
        description: trimmedDescription ? trimmedDescription : undefined,
      })
      setIsEditing(false)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unable to save changes. Please retry.'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (disableInteractions) return

    const confirmDelete = window.confirm('Are you sure you want to delete this todo?')

    if (!confirmDelete) return

    try {
      setIsDeleting(true)
      setErrorMessage(null)
      await onDelete(todo.id)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unable to delete the todo. Please retry.'
      setErrorMessage(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setErrorMessage(null)
    setFormState({
      title: todo.title,
      description: todo.description ?? '',
    })
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-1 items-start gap-3">
          <button
            type="button"
            aria-label={todo.completed ? 'Mark todo as incomplete' : 'Mark todo as complete'}
            onClick={handleToggle}
            disabled={disableInteractions}
            className={`mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
              todo.completed ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
            } transition disabled:cursor-not-allowed`}
          >
            {isToggling ? (
              <Spinner size="sm" className="text-white" />
            ) : todo.completed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 5.292a1 1 0 0 1 0 1.416l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414l2.543 2.543 6.543-6.543a1 1 0 0 1 1.414 0"
                  clipRule="evenodd"
                />
              </svg>
            ) : null}
          </button>

          <div className="flex-1 space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor={`edit-title-${todo.id}`}>
                    Title
                  </label>
                  <input
                    id={`edit-title-${todo.id}`}
                    value={formState.title}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    maxLength={120}
                    autoFocus
                    disabled={disableInteractions}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor={`edit-description-${todo.id}`}>
                    Description
                  </label>
                  <textarea
                    id={`edit-description-${todo.id}`}
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={3}
                    disabled={disableInteractions}
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p
                  className={`text-base font-semibold text-slate-900 ${
                    todo.completed ? 'line-through decoration-2 decoration-primary/70 text-slate-500' : ''
                  }`}
                >
                  {todo.title}
                </p>
                {todo.description ? (
                  <p className="text-sm text-slate-600">{todo.description}</p>
                ) : null}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              {createdLabel ? <span>Created {createdLabel}</span> : null}
              {updatedLabel ? <span>Updated {updatedLabel}</span> : null}
              {todo.completed ? <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">Completed</span> : null}
            </div>

            {errorMessage ? <p className="text-sm text-red-600" role="alert">{errorMessage}</p> : null}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={disableInteractions}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? <Spinner size="sm" className="mr-1" /> : null}
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={disableInteractions}
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={disableInteractions}
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={disableInteractions}
                className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Spinner size="sm" className="mr-1 text-red-600" /> : null}
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}
