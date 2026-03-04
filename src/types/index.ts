export type Platform = 'twitter' | 'reddit'
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export interface ScheduledPost {
  id: string
  platform: Platform
  content: string
  scheduledAt: string
  status: PostStatus
  createdAt: string
  imageDataUrl?: string
  // Twitter specific
  twitterHandle?: string
  // Reddit specific
  subreddit?: string
  redditTitle?: string
  redditPostType?: 'text' | 'link' | 'image'
  redditUrl?: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  updated_at: string
  category?: string
  tags?: string[]
  status?: 'active' | 'archived' | 'pending'
  likes?: number
  replies?: number
}
