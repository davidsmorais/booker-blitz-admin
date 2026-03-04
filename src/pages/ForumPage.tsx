import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import {
  BookOpen,
  RefreshCw,
  Search,
  AlertCircle,
  MessageCircle,
  Heart,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import type { ForumPost } from '@/types'

export function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const hasSupabase =
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

  const fetchPosts = useCallback(async () => {
    if (!hasSupabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('discussions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw supabaseError
      }

      setPosts((data as ForumPost[]) ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch posts'
      setError(message)
      toast({
        variant: 'destructive',
        title: 'Error fetching posts',
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }, [hasSupabase, search])

  useEffect(() => {
    if (hasSupabase) {
      void fetchPosts()
    }
  }, [fetchPosts, hasSupabase])

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'archived':
        return 'secondary'
      case 'pending':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-violet-500" />
          Forum Posts
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage discussions from{' '}
          <a
            href="https://bookerblitz.com/discussions"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2 inline-flex items-center gap-1"
          >
            bookerblitz.com/discussions
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {!hasSupabase && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            <strong>Supabase not configured.</strong> Add{' '}
            <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to your{' '}
            <code className="font-mono">.env</code> file to connect to your database.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Discussions</CardTitle>
              <CardDescription>
                {loading
                  ? 'Loading…'
                  : `${posts.length} discussion${posts.length !== 1 ? 's' : ''} found`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void fetchPosts()}
                  className="pl-8 w-56"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => void fetchPosts()}
                disabled={loading || !hasSupabase}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && !loading && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-4">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {!hasSupabase ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Configure Supabase to view forum posts.
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No discussions found. Try adjusting your search or refreshing.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold leading-tight">{post.title}</h3>
                      {post.content && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {post.content}
                        </p>
                      )}
                    </div>
                    {post.status && (
                      <Badge
                        variant={getStatusVariant(post.status)}
                        className="text-xs capitalize shrink-0"
                      >
                        {post.status}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                    {post.author && (
                      <span className="font-medium text-foreground">
                        @{post.author}
                      </span>
                    )}
                    {post.created_at && (
                      <span>{format(new Date(post.created_at), 'PPp')}</span>
                    )}
                    {post.category && (
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    )}
                    <div className="ml-auto flex items-center gap-3">
                      {post.likes !== undefined && (
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                      )}
                      {post.replies !== undefined && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.replies}
                        </span>
                      )}
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Showing {posts.length} most recent discussions.{' '}
          <button
            onClick={() => void fetchPosts()}
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Refresh
          </button>
        </p>
      )}
    </div>
  )
}
