import { Calendar, Twitter, MessageSquare, Clock } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ScheduledPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Calendar className="h-8 w-8 text-emerald-500" />
          Scheduled Posts
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of all your scheduled social media posts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Twitter Queue</CardTitle>
            <Twitter className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">tweets scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reddit Queue</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">posts scheduled</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Posts
          </CardTitle>
          <CardDescription>
            All scheduled posts across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-10 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No scheduled posts yet. Head to the Twitter or Reddit pages to schedule posts.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Scheduling Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <Badge variant="secondary" className="shrink-0 mt-0.5">1</Badge>
            <p>Compose your post on the Twitter or Reddit page and set a scheduled date/time.</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="secondary" className="shrink-0 mt-0.5">2</Badge>
            <p>Posts are saved locally. When you have configured your API keys in <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">.env</code>, the app can submit them to the respective platform at the scheduled time.</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="secondary" className="shrink-0 mt-0.5">3</Badge>
            <p>Monitor the status of each post (draft → scheduled → published).</p>
          </div>
          <div className="rounded-md bg-muted p-3 mt-2 text-xs font-mono">
            VITE_TWITTER_BEARER_TOKEN=...<br />
            VITE_TWITTER_API_KEY=...<br />
            VITE_TWITTER_API_SECRET=...<br />
            VITE_TWITTER_ACCESS_TOKEN=...<br />
            VITE_TWITTER_ACCESS_TOKEN_SECRET=...<br />
            <br />
            VITE_REDDIT_CLIENT_ID=...<br />
            VITE_REDDIT_CLIENT_SECRET=...<br />
            VITE_REDDIT_USERNAME=...<br />
            VITE_REDDIT_PASSWORD=...<br />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
