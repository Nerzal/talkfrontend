import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomeScreen } from './pages/HomeScreen'
import { TalkView } from './pages/TalkView'
import { TalksProvider } from './data/TalksContext'
import { TagList } from './pages/HomeScreen/TagList'
import { TagTalkList } from './pages/HomeScreen/TagTalkList'

export function App() {
  return (
    <BrowserRouter>
      <TalksProvider>
        <Routes>
          <Route path="/talk/:id" element={<TalkView />} />
          <Route path="/tags/:tag" element={<TagTalkList />} />
          <Route path="/tags" element={<TagList />} />
          <Route path="/:year/:month" element={<HomeScreen />} />
          <Route path="/:year" element={<HomeScreen />} />
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </TalksProvider>
    </BrowserRouter>
  )
}
