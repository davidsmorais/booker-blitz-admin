import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Twitter,
  MessageSquare,
  BookOpen,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/twitter', label: 'Twitter', icon: Twitter },
  { to: '/reddit', label: 'Reddit', icon: MessageSquare },
  { to: '/forum', label: 'Forum Posts', icon: BookOpen },
  { to: '/scheduled', label: 'Scheduled', icon: Calendar },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] shadow-lg">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--sidebar-primary))]">
          <BookOpen className="h-5 w-5 text-[hsl(var(--sidebar-primary-foreground))]" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">BookerBlitz</p>
          <p className="text-xs text-[hsl(var(--sidebar-foreground)/0.6)]">
            Admin Dashboard
          </p>
        </div>
      </div>

      <Separator className="bg-[hsl(var(--sidebar-border))]" />

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]'
                  : 'text-[hsl(var(--sidebar-foreground)/0.8)] hover:bg-[hsl(var(--sidebar-accent)/0.5)] hover:text-[hsl(var(--sidebar-accent-foreground))]'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-[hsl(var(--sidebar-border))]" />
      <div className="px-6 py-4">
        <p className="text-xs text-[hsl(var(--sidebar-foreground)/0.5)]">
          bookerblitz.com
        </p>
      </div>
    </aside>
  )
}
