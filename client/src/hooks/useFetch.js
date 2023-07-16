import { QueryClient, useInfiniteQuery, useQueries, useQuery, useSuspenseInfiniteQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query'
import { isArray, get } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'

import { baseApi } from '../api/http-common'

import useAxios from './useAxios'

const queryClient = new QueryClient()

const useFetch = ({ api = baseApi, id, key, services, combine, queryOptions = {}, auth = false, infinite = false, suspense = false }) => {
  const isParallel = isArray(services)
  const instance = useAxios(api, auth)
  const queryKey = isArray(id) ? id : [id]
  const queries = useMemo(() => {
    if (isParallel) {
      return services.map((request) => {
        const id = get(request, key)
        return ({
          queryKey: [...queryKey, id],
          queryFn: () => fetchApi(request)
        })
      })
    }
  }, [services, isParallel, key, id])

  const fetchApi = useCallback(async ({ request = services, signal }) => {
    console.log(signal)
    const response = await instance.request({ ...request, signal })
    return response.data
  }, [services, instance])

  useEffect(() => {
    return () => {
      queryClient.cancelQueries(queryKey)
    }
  }, [])

  if (infinite && suspense) {
    return { query: useSuspenseInfiniteQuery({ queryKey, queryFn: fetchApi, ...queryOptions }), fn: fetchApi }
  }
  if (infinite) {
    return { query: useInfiniteQuery({ queryKey, queryFn: fetchApi, ...queryOptions }), fn: fetchApi }
  }
  if (suspense) {
    if (isParallel) {
      return useSuspenseQueries({ queries, combine })
    }
    return { query: useSuspenseQuery({ queryKey, queryFn: fetchApi, ...queryOptions }), fn: fetchApi }
  }
  if (isParallel) {
    console.log(queries)
    return useQueries({ queries, combine })
  }
  return { query: useQuery({ queryKey, queryFn: fetchApi, ...queryOptions }), fn: fetchApi }
}

export default useFetch
