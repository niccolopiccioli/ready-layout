'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Canvas } from './Canvas'
import { Sidebar } from './Sidebar'

export function EditorLayout() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">Startup Launchpad</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">draft</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/preview/demo" target="_blank">
            <Button variant="outline" size="sm" className="text-xs">
              Preview ↗
            </Button>
          </Link>
          <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700">
            Pubblica
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Canvas />
        <Sidebar />
      </div>
    </div>
  )
}
