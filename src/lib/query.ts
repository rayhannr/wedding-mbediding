import { Config, Invitee, Rsvp } from '@/lib/schema'
import { QueryClient } from '@tanstack/query-core'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import axios from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

export const useRSVPs = (options?: Omit<UseQueryOptions<Rsvp[]>, 'queryKey'>) => {
  const queryFn = async () => {
    const { data } = await axios.get<Rsvp[]>('/api/rsvp')
    return data
  }

  return useQuery(
    {
      queryKey: ['rsvp'],
      queryFn,
      ...options
    },
    queryClient
  )
}

export const useAdminRSVPs = (options?: Omit<UseQueryOptions<Rsvp[]>, 'queryKey'>) => {
  const queryFn = async () => {
    const { data } = await axios.get<Rsvp[]>('/api/admin/rsvp')
    return data
  }

  return useQuery(
    {
      queryKey: ['admin-rsvp'],
      queryFn,
      ...options
    },
    queryClient
  )
}

export const useInvitees = (options?: Omit<UseQueryOptions<Invitee[]>, 'queryKey'>) => {
  const queryFn = async () => {
    const { data } = await axios.get<Invitee[]>('/api/admin/invitees')
    return data
  }

  return useQuery(
    {
      queryKey: ['invitees'],
      queryFn,
      ...options
    },
    queryClient
  )
}

export const useConfig = (id: string, options?: Omit<UseQueryOptions<Config>, 'queryKey'>) => {
  const queryFn = async () => {
    const { data } = await axios.get<Config>(`/api/admin/config/${id}`)
    return data
  }

  return useQuery(
    {
      queryKey: ['config', id],
      queryFn,
      ...options
    },
    queryClient
  )
}
