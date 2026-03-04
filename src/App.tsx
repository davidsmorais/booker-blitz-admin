import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { TwitterPage } from '@/pages/TwitterPage'
import { RedditPage } from '@/pages/RedditPage'
import { ForumPage } from '@/pages/ForumPage'
import { ScheduledPage } from '@/pages/ScheduledPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="twitter" element={<TwitterPage />} />
          <Route path="reddit" element={<RedditPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="scheduled" element={<ScheduledPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

