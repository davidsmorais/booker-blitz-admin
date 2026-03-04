import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Twitter, Send, Clock, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import type { ScheduledPost } from '@/types'

const TWITTER_MAX_CHARS = 280

const tweetSchema = z.object({
  content: z
    .string()
    .min(1, 'Tweet content is required')
    .max(TWITTER_MAX_CHARS, `Tweet must be ${TWITTER_MAX_CHARS} characters or less`),
  scheduledAt: z.string().min(1, 'Schedule date/time is required'),
  twitterHandle: z.string().optional(),
})

type TweetFormValues = z.infer<typeof tweetSchema>

export function TwitterPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TweetFormValues>({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      content: '',
      scheduledAt: '',
      twitterHandle: '',
    },
  })

  const contentValue = watch('content')

  const onSubmit = async (data: TweetFormValues) => {
    const apiConfigured = Boolean(import.meta.env.VITE_TWITTER_BEARER_TOKEN)

    const newPost: ScheduledPost = {
      id: crypto.randomUUID(),
      platform: 'twitter',
      content: data.content,
      scheduledAt: data.scheduledAt,
      status: apiConfigured ? 'scheduled' : 'draft',
      createdAt: new Date().toISOString(),
      twitterHandle: data.twitterHandle,
    }

    setPosts((prev) => [newPost, ...prev])
    reset()
    toast({
      title: apiConfigured ? 'Tweet scheduled!' : 'Tweet saved as draft',
      description: apiConfigured
        ? `Scheduled for ${format(new Date(data.scheduledAt), 'PPp')}`
        : 'Add Twitter API keys in .env to enable publishing.',
    })
  }

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
    toast({ title: 'Tweet removed' })
  }

  const remaining = TWITTER_MAX_CHARS - (contentValue?.length ?? 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Twitter className="h-8 w-8 text-sky-500" />
          Twitter Scheduler
        </h1>
        <p className="text-muted-foreground mt-1">
          Schedule tweets for BookerBlitz.
        </p>
      </div>

      {!import.meta.env.VITE_TWITTER_BEARER_TOKEN && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            <strong>Twitter API not configured.</strong> Add{' '}
            <code className="font-mono">VITE_TWITTER_BEARER_TOKEN</code>,{' '}
            <code className="font-mono">VITE_TWITTER_API_KEY</code>, and{' '}
            <code className="font-mono">VITE_TWITTER_API_SECRET</code> to your{' '}
            <code className="font-mono">.env</code> file to enable posting. Posts will
            be saved locally until the API is configured.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compose Tweet</CardTitle>
            <CardDescription>Write and schedule a new tweet</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitterHandle">Twitter Handle (optional)</Label>
                <Input
                  id="twitterHandle"
                  placeholder="@bookerblitz"
                  {...register('twitterHandle')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Tweet Content</Label>
                <div className="relative">
                  <Textarea
                    id="content"
                    placeholder="What's happening with BookerBlitz? ..."
                    rows={5}
                    className="resize-none pr-16"
                    {...register('content')}
                  />
                  <span
                    className={`absolute bottom-2 right-3 text-xs font-medium ${
                      remaining < 20
                        ? remaining < 0
                          ? 'text-destructive'
                          : 'text-amber-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {remaining}
                  </span>
                </div>
                {errors.content && (
                  <p className="text-xs text-destructive">{errors.content.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  {...register('scheduledAt')}
                />
                {errors.scheduledAt && (
                  <p className="text-xs text-destructive">
                    {errors.scheduledAt.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                Schedule Tweet
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Tweets
            </CardTitle>
            <CardDescription>
              {posts.length} tweet{posts.length !== 1 ? 's' : ''} in queue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No scheduled tweets yet. Compose one on the left!
              </p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="group flex flex-col gap-2 rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1 whitespace-pre-wrap">{post.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(post.scheduledAt), 'PPp')}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs capitalize text-sky-600 border-sky-200"
                      >
                        {post.status}
                      </Badge>
                      {post.twitterHandle && (
                        <span className="text-xs text-muted-foreground">
                          {post.twitterHandle}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
