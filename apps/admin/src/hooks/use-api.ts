import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, errorMessage, unwrap } from '@/lib/api'

/** GET a backend list/object: `useApiQuery<Product[]>(['products'], '/products')` */
export const useApiQuery = <T>(
  key: unknown[],
  path: string,
  params?: Record<string, unknown>
) =>
  useQuery({
    queryKey: [...key, path, params ?? {}],
    queryFn: async () => unwrap<T>(await api.get(path, { params })),
  })

/**
 * Mutation that shows a toast, and on success invalidates the given query keys
 * so the list is re-read from the server (no hand-patched local state).
 */
export const useApiMutation = <TVars>(
  fn: (vars: TVars) => Promise<unknown>,
  { invalidate, success }: { invalidate: unknown[][]; success: string }
) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      toast.success(success)
      await Promise.all(
        invalidate.map((queryKey) => qc.invalidateQueries({ queryKey }))
      )
    },
    onError: (err) => toast.error(errorMessage(err)),
  })
}
