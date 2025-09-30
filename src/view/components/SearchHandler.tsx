'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function SearchHandler({ setSearch }: { setSearch: (search: string) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const searchParam = searchParams.get('search')
    setSearch(searchParam || '')
  }, [searchParams, setSearch])

  return null
}