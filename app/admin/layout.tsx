import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import AdminNav from './AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user?.id).single()

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans selection:bg-blue-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-zinc-200 flex-shrink-0 md:min-h-screen">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="text-lg font-bold tracking-tight text-zinc-900">AdminPanel</span>
          </div>
        </div>
        <AdminNav />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-10 w-full">
          <div className="text-sm font-medium text-zinc-500">Welcome back, <span className="text-zinc-900">{profile?.full_name || 'Admin'}</span></div>
          <form action="/api/auth/signout" method="post">
            <button className="text-sm font-semibold text-zinc-600 hover:text-red-600 transition-colors">Sign out</button>
          </form>
        </header>
        <div className="flex-1 overflow-y-auto w-full">
            {children}
        </div>
      </main>
    </div>
  )
}
