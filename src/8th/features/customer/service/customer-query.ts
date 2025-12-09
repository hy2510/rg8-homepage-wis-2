import { OverrideQueryOptions } from '@/8th/shared/react-query/types'
import { useQuery } from '@tanstack/react-query'
import { getFindCustomer } from '../model/find-customer'
import { getSearchCustomer } from '../model/search-customer'

export function useFindCustomer(
  params: {
    customerId: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: ['customer', 'find'],
    queryFn: () => getFindCustomer(params),
  })
}

export function useSearchCustomer(
  params: {
    keyword?: string
    type?: string
    countryCode?: string
  },
  options?: OverrideQueryOptions,
) {
  return useQuery({
    ...options,
    queryKey: ['customer', 'search'],
    queryFn: () => getSearchCustomer(params),
  })
}
