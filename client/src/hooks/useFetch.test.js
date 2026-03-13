import { useInfiniteQuery, useSuspenseInfiniteQuery, useQuery, useSuspenseQuery, useQueries, useSuspenseQueries } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'

import mockBaseApi from '../api/__mocks__/http-common'

import useFetch from './useFetch'

jest.mock('axios')
jest.mock('./useAxios')
jest.mock('@tanstack/react-query')

describe('React query correct type called', () => {
  const config = { api: mockBaseApi, id: 'test', services: { url: '/test' } }
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('useInfinite is called', async () => {
    const { result } = renderHook(() => useFetch({ ...config, infinite: true }))

    expect(useInfiniteQuery).toHaveBeenCalledTimes(1)
    expect(useInfiniteQuery).toHaveBeenCalledWith({
      queryKey: [config.id],
      queryFn: result.current.fn
    })
  })
  it('useSuspenseInfinite is called', async () => {
    const { result } = renderHook(() => useFetch({ ...config, infinite: true, suspense: true }))

    expect(useSuspenseInfiniteQuery).toHaveBeenCalledTimes(1)
    expect(useSuspenseInfiniteQuery).toHaveBeenCalledWith({
      queryKey: [config.id],
      queryFn: result.current.fn
    })
  })
  it('useQuery is called', async () => {
    const { result } = renderHook(() => useFetch(config))

    expect(useQuery).toHaveBeenCalledTimes(1)
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [config.id],
      queryFn: result.current.fn
    })
  })
  it('useSuspense is called', async () => {
    const { result } = renderHook(() => useFetch({ ...config, suspense: true }))

    expect(useSuspenseQuery).toHaveBeenCalledTimes(1)
    expect(useSuspenseQuery).toHaveBeenCalledWith({
      queryKey: [config.id],
      queryFn: result.current.fn
    })
  })
})

describe('Parallel queries', () => {
  const services = [0, 1, 3].map((param) => ({
    url: '/test',
    params: {
      id: param
    }
  }))
  const config = { api: mockBaseApi, id: 'test', services, key: 'params.id' }
  const queries = [
    { queryKey: [config.id, 0], queryFn: expect.any(Function) },
    { queryKey: [config.id, 1], queryFn: expect.any(Function) },
    { queryKey: [config.id, 3], queryFn: expect.any(Function) }
  ]
  it('useQueries', () => {
    renderHook(() => useFetch(config))

    expect(useQueries).toHaveBeenCalledTimes(1)
    expect(useQueries).toHaveBeenCalledWith({
      queries
    })
  })
  it('useSuspenseQueries', () => {
    renderHook(() => useFetch({ ...config, suspense: true }))

    expect(useSuspenseQueries).toHaveBeenCalledTimes(1)
    expect(useSuspenseQueries).toHaveBeenCalledWith({
      queries
    })
  })
})
