import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ApiError } from '../api/client'
import { todosApi } from '../api/todos'
import type { Todo, TodoCreateInput, TodoUpdateInput } from '../api/types'

const TODOS_QUERY_KEY = ['todos'] as const

type UpdateVariables = { id: string; input: TodoUpdateInput }

export const useTodos = () => {
  const queryClient = useQueryClient()

  const listQuery = useQuery<Todo[], ApiError>({
    queryKey: TODOS_QUERY_KEY,
    queryFn: todosApi.list,
  })

  const createMutation = useMutation<
    Todo | undefined,
    ApiError,
    TodoCreateInput,
    { previousTodos: Todo[]; optimisticTodo: Todo }
  >(
    {
      mutationFn: (payload) => todosApi.create(payload),
      onMutate: async (payload) => {
        await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })

        const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY) ?? []

        const optimisticTodo: Todo = {
          id: `temp-${Date.now()}`,
          title: payload.title,
          description: payload.description,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, [optimisticTodo, ...previousTodos])

        return { previousTodos, optimisticTodo }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
        }
      },
      onSuccess: (todo, _variables, context) => {
        if (!context || !todo) {
          queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
          return
        }

        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (current) =>
          (current ?? []).map((item) => (item.id === context.optimisticTodo.id ? todo : item))
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
      },
    }
  )

  const updateMutation = useMutation<
    Todo | undefined,
    ApiError,
    UpdateVariables,
    { previousTodos: Todo[] | undefined }
  >(
    {
      mutationFn: ({ id, input }) => todosApi.update(id, input),
      onMutate: async ({ id, input }) => {
        await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })

        const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY)

        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (current) =>
          (current ?? []).map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...input,
                  updatedAt: new Date().toISOString(),
                }
              : item
          )
        )

        return { previousTodos }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
        }
      },
      onSuccess: (todo, variables) => {
        if (!todo) {
          queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
          return
        }

        const matchId = todo.id ?? variables.id

        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (current) =>
          (current ?? []).map((item) => (item.id === matchId ? { ...item, ...todo } : item))
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
      },
    }
  )

  const deleteMutation = useMutation<void, ApiError, string, { previousTodos: Todo[] | undefined }>(
    {
      mutationFn: (id) => todosApi.remove(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })

        const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY)

        queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (current) =>
          (current ?? []).filter((item) => item.id !== id)
        )

        return { previousTodos }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
      },
    }
  )

  const createTodo = useCallback(
    async (payload: TodoCreateInput) => {
      const todo = await createMutation.mutateAsync(payload)
      return todo
    },
    [createMutation]
  )

  const updateTodo = useCallback(
    async (id: string, input: TodoUpdateInput) => {
      const todo = await updateMutation.mutateAsync({ id, input })
      return todo
    },
    [updateMutation]
  )

  const toggleTodo = useCallback(
    async (id: string, completed: boolean) => {
      const todo = await updateMutation.mutateAsync({ id, input: { completed } })
      return todo
    },
    [updateMutation]
  )

  const deleteTodo = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id)
    },
    [deleteMutation]
  )

  return {
    todos: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
