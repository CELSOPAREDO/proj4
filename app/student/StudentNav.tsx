'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/student/profile', label: 'My Profile', icon: '👤' },
  { href: '/student/dashboard', label: 'Dashboard', icon: null },
  { href: '/student/registrations', label: 'My Registrations', icon: '🎟️' },
]

export default function StudentNav() {
  const pathname = usePathname()

  return (
    <div className="p-4 space-y-1">
      {links.map(({ href, label, icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex justify-between items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
              isActive
                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 font-semibold'
                : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            <span>{label}</span>
            {icon && <span>{icon}</span>}
          </Link>
        )
      })}
    </div>
  )
}
