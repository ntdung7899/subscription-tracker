'use client'

import { useState, useEffect } from 'react'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFetch<T>(url: string, options?: FetchOptions): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      let fetchUrl = url
      if (options?.params) {
        const searchParams = new URLSearchParams(options.params)
        fetchUrl = `${url}?${searchParams.toString()}`
      }

      const response = await fetch(fetchUrl, options)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}
