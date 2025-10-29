import { FormEvent, useState } from 'react'

import type { TodoCreateInput } from '../../../api/types'
import { ApiError } from '../../../api/client'
import { Spinner } from '../../../components/Spinner'

type TodoFormProps = {
  onSubmit: (payload: TodoCreateInput) => Promise<unknown>
  isSubmitting: boolean
}

const createInitialFormState = () => ({
  title: '',
  description: '',
})

export const TodoForm = ({ onSubmit, isSubmitting }: TodoFormProps) => {
  const [values, setValues] = useState(createInitialFormState)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isDisabled = isSubmitting

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = values.title.trim()
    const trimmedDescription = values.description?.trim()

    if (!trimmedTitle) {
      setErrorMessage('Please provide a title for your todo item.')
      return
    }

    try {
      setErrorMessage(null)

      await onSubmit({
        title: trimmedTitle,
        description: trimmedDescription ? trimmedDescription : undefined,
      })

      setValues(createInitialFormState())
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'We were unable to create the todo. Please try again.'

      setErrorMessage(message)
    }
  }

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Create a todo</h2>
        <p className="text-sm text-slate-600">
          Add a new task with an optional description. Titles are required and limited to 120 characters.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="todo-title">
            Title
          </label>
          <input
            id="todo-title"
            name="title"
            maxLength={120}
            value={values.title}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="e.g. Schedule code review"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={isDisabled}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="todo-description">
            Description <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="todo-description"
            name="description"
            value={values.description ?? ''}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Provide additional context or steps."
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={isDisabled}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            'Add todo'
          )}
        </button>
      </div>
    </form>
  )
}
