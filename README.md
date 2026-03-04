# booker-blitz-admin

A local admin dashboard for [BookerBlitz](https://bookerblitz.com) to schedule Twitter/Reddit posts and manage forum discussions via Supabase.

## Features

- **Twitter Scheduler** — compose and queue tweets with a 280-character counter and scheduled date/time
- **Reddit Scheduler** — schedule text or link posts to any subreddit with quick-select chips for common book communities
- **Forum Posts** — browse and search the BookerBlitz discussions table from your Supabase database
- **Scheduled Overview** — view all queued posts across platforms

## Tech Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components (Radix UI primitives)
- [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- [React Router](https://reactrouter.com/), [date-fns](https://date-fns.org/), [lucide-react](https://lucide.dev/)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your credentials in `.env`:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `VITE_TWITTER_BEARER_TOKEN` | Twitter API Bearer Token |
| `VITE_TWITTER_API_KEY` | Twitter API Key |
| `VITE_TWITTER_API_SECRET` | Twitter API Secret |
| `VITE_TWITTER_ACCESS_TOKEN` | Twitter Access Token |
| `VITE_TWITTER_ACCESS_TOKEN_SECRET` | Twitter Access Token Secret |
| `VITE_REDDIT_CLIENT_ID` | Reddit app Client ID |
| `VITE_REDDIT_CLIENT_SECRET` | Reddit app Client Secret |
| `VITE_REDDIT_USERNAME` | Reddit account username |
| `VITE_REDDIT_PASSWORD` | Reddit account password |

**Twitter:** Create a developer app at [developer.twitter.com](https://developer.twitter.com/)
**Reddit:** Create a "script" app at [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
**Supabase:** Find your URL and anon key in *Project Settings → API*

> Posts are saved to the local queue regardless of API configuration. Without API keys, posts are saved as `draft`; once keys are provided they are marked `scheduled`.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build

```bash
npm run build
```
