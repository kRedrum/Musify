import { useEffect } from 'react'

const useAxios = (api, auth) => {
  useEffect(() => {
    const response = responseInterceptors()
    return () => {
      api.interceptors.response.eject(response)
    }
  })

  const responseInterceptors = () => {
    return api.interceptors.response.use(
      (response) => response,
      (error) => error
    )
  }

  return api
}

export default useAxios
