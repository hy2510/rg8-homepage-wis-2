import {
  OverrideMutationOptions,
  OverrideQueryOptions,
} from '@/8th/shared/react-query/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getClassGroupList } from '../model/class-group-list'
import { getClassList } from '../model/class-list'
import { deleteLogout } from '../model/logout'
import { accountKeys } from './account-key'

export function useClassGroupList(options?: OverrideQueryOptions) {
  return useQuery({
    ...options,
    queryKey: accountKeys.classGroupList(),
    queryFn: () => getClassGroupList(),
  })
}

export function useClassList(
  params: {
    classGroupId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: accountKeys.classList(params),
    queryFn: () => getClassList(params),
  })
}

export function useLogout(options?: OverrideMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: () => deleteLogout(),
    onSuccess: (data, variables) => {
      queryClient.removeQueries({ queryKey: [] })

      if (options?.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
  })
}
