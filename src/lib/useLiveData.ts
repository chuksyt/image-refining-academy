'use client'
import { useEffect, useState } from 'react'

/**
 * Client hook: render `seed` immediately (SSR-safe, no layout shift), then swap
 * in the director's live content fetched from a public API route. `key` is the
 * property to read out of the JSON response (e.g. "courses").
 */
export function useLiveData<T>(url: string, key: string, seed: T): T {
  const [data, setData] = useState<T>(seed)
  useEffect(() => {
    let active = true
    fetch(url)
      .then(r => (r.ok ? r.json() : null))
      .then((json: Record<string, unknown> | null) => {
        const value = json?.[key]
        if (active && value !== undefined && value !== null) setData(value as T)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [url, key])
  return data
}
