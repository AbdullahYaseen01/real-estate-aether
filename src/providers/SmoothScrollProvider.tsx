import { type ReactNode } from 'react'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

interface SmoothScrollProviderProps {
  children: ReactNode
  enabled?: boolean
}

export function SmoothScrollProvider({
  children,
  enabled = true,
}: SmoothScrollProviderProps) {
  useSmoothScroll(enabled)
  return <>{children}</>
}
