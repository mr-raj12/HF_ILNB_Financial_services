'use client'
import { useEffect } from 'react'

export default function ThemeWrapper({ selectedBroker }: { selectedBroker: string }) {
  useEffect(() => {
    const body = document.body
    body.classList.remove('zerodha-theme', 'upstox-theme')
    body.classList.add(selectedBroker === 'Upstox' ? 'upstox-theme' : 'zerodha-theme')
    body.classList.add('transition-theme')
  }, [selectedBroker])

  return null
}