import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { MessageSquare, Send, Clock, Trash2, AlertCircle, Link as LinkIcon, AlignLeft, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from '@/hooks/use-toast'
import type { ScheduledPost } from '@/types'

const BOOKERBLITZ_SUBREDDIT = 'r/BookerBlitz'

const redditPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  postType: z.enum(['text', 'link', 'image']),
  content: z.string().optional(),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  scheduledAt: z.string().min(1, 'Schedule date/time is required'),
})

type RedditPostFormValues = z.infer<typeof redditPostSchema>

const ALSO_POST_TO = [
  'r/books',
  'r/fantasy',
  'r/scifi',
  'r/bookclub',
  'r/suggestmeabook',
  'r/literature',
  'r/kindle',
  'r/reading',
]

export function RedditPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [postType, setPostType] = useState<'text' | 'link' | 'image'>('text')
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RedditPostFormValues>({
    resolver: zodResolver(redditPostSchema),
    defaultValues: {
      title: '',
      postType: 'text',
      content: '',
      url: '',
      scheduledAt: '',
    },
  })

  const onSubmit = async (data: RedditPostFormValues) => {
    const apiConfigured = Boolean(import.meta.env.VITE_REDDIT_CLIENT_ID)

    const newPost: ScheduledPost = {
      id: crypto.randomUUID(),
      platform: 'reddit',
      content: data.content ?? '',
      scheduledAt: data.scheduledAt,
      status: apiConfigured ? 'scheduled' : 'draft',
      createdAt: new Date().toISOString(),
      subreddit: BOOKERBLITZ_SUBREDDIT,
      redditTitle: data.title,
      redditPostType: data.postType,
      redditUrl: data.url,
      imageDataUrl: data.postType === 'image' ? imageDataUrl : undefined,
    }

    setPosts((prev) => [newPost, ...prev])
    reset()
    setPostType('text')
    setImageDataUrl(undefined)
    toast({
      title: apiConfigured ? 'Reddit post scheduled!' : 'Post saved as draft',
      description: apiConfigured
        ? `Scheduled for ${format(new Date(data.scheduledAt), 'PPp')}`
        : 'Add Reddit API keys in .env to enable publishing.',
    })
  }

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
    toast({ title: 'Post removed' })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-orange-400" />
          Reddit Scheduler
        </h1>
        <p className="text-muted-foreground mt-1">
          Schedule posts to{' '}
          <span className="font-medium text-orange-400">{BOOKERBLITZ_SUBREDDIT}</span>.
        </p>
      </div>

      {!import.meta.env.VITE_REDDIT_CLIENT_ID && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            <strong>Reddit API not configured.</strong> Add{' '}
            <code className="font-mono">VITE_REDDIT_CLIENT_ID</code>,{' '}
            <code className="font-mono">VITE_REDDIT_CLIENT_SECRET</code>, and{' '}
            <code className="font-mono">VITE_REDDIT_USERNAME</code> /{' '}
            <code className="font-mono">VITE_REDDIT_PASSWORD</code> to your{' '}
            <code className="font-mono">.env</code> file. Posts will be saved as drafts
            until the API is configured.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compose Post</CardTitle>
            <CardDescription>
              Posting to{' '}
              <span className="text-orange-400 font-medium">{BOOKERBLITZ_SUBREDDIT}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  placeholder="BookerBlitz — discover your next great read"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Post Type</Label>
                <Tabs
                  value={postType}
                  onValueChange={(v) => {
                    const val = v as 'text' | 'link' | 'image'
                    setPostType(val)
                    setValue('postType', val)
                  }}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="text" className="flex-1 gap-1.5">
                      <AlignLeft className="h-3.5 w-3.5" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="link" className="flex-1 gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5" />
                      Link
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex-1 gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Image
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-3">
                    <Textarea
                      placeholder="Write your post content here..."
                      rows={5}
                      className="resize-none"
                      {...register('content')}
                    />
                  </TabsContent>
                  <TabsContent value="link" className="mt-3">
                    <Input
                      placeholder="https://bookerblitz.com"
                      type="url"
                      {...register('url')}
                    />
                    {errors.url && (
                      <p className="text-xs text-destructive mt-1">{errors.url.message}</p>
                    )}
                  </TabsContent>
                  <TabsContent value="image" className="mt-3 space-y-3">
                    <ImageUpload value={imageDataUrl} onChange={setImageDataUrl} />
                    <Textarea
                      placeholder="Optional caption / body text..."
                      rows={3}
                      className="resize-none"
                      {...register('content')}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label htmlFor="redditScheduledAt">Schedule Date & Time</Label>
                <Input
                  id="redditScheduledAt"
                  type="datetime-local"
                  {...register('scheduledAt')}
                />
                {errors.scheduledAt && (
                  <p className="text-xs text-destructive">
                    {errors.scheduledAt.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Also commonly posted to:</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALSO_POST_TO.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                Schedule Post
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Posts
            </CardTitle>
            <CardDescription>
              {posts.length} post{posts.length !== 1 ? 's' : ''} in queue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No scheduled posts yet. Compose one on the left!
              </p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="group flex flex-col gap-2 rounded-lg border p-3"
                  >
                    {post.imageDataUrl && (
                      <img
                        src={post.imageDataUrl}
                        alt="Post image"
                        className="rounded-md max-h-32 w-full object-cover"
                      />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {post.redditTitle}
                        </p>
                        {post.redditPostType === 'text' && post.content && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {post.content}
                          </p>
                        )}
                        {post.redditPostType === 'link' && post.redditUrl && (
                          <a
                            href={post.redditUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary underline underline-offset-2 truncate block"
                          >
                            {post.redditUrl}
                          </a>
                        )}
                      </div>
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
                      <Badge
                        variant="secondary"
                        className="text-xs text-orange-400 bg-orange-500/10 border-orange-500/20"
                      >
                        {post.subreddit}
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(post.scheduledAt), 'PPp')}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {post.redditPostType}
                      </Badge>
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
