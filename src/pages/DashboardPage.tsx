import { Twitter, MessageSquare, BookOpen, Calendar, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const stats = [
  {
    title: 'Scheduled Tweets',
    value: '—',
    description: 'Pending Twitter posts',
    icon: Twitter,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    title: 'Reddit Posts',
    value: '—',
    description: 'Pending Reddit posts',
    icon: MessageSquare,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    title: 'Forum Discussions',
    value: '—',
    description: 'Active discussions',
    icon: BookOpen,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    title: 'Total Scheduled',
    value: '—',
    description: 'Across all platforms',
    icon: Calendar,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your BookerBlitz social media and forum posts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-md p-1.5 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>Get started with your first post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Twitter className="h-5 w-5 text-sky-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">Schedule a Tweet</p>
                <p className="text-xs text-muted-foreground">
                  Promote BookerBlitz on Twitter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <MessageSquare className="h-5 w-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">Post to Reddit</p>
                <p className="text-xs text-muted-foreground">
                  Share in relevant subreddits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <BookOpen className="h-5 w-5 text-violet-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">Manage Forum Posts</p>
                <p className="text-xs text-muted-foreground">
                  View and moderate discussions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>BookerBlitz Admin Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This dashboard helps you manage social media marketing for{' '}
              <a
                href="https://bookerblitz.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                bookerblitz.com
              </a>
              .
            </p>
            <p>
              Schedule posts for Twitter and Reddit, and manage the community
              discussions from your Supabase database.
            </p>
            <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs font-mono">
              Configure your API keys in the <strong>.env</strong> file to get
              started.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
