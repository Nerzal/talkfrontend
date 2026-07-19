import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomeScreen } from './pages/HomeScreen'
import { TalkView } from './pages/TalkView'
import { TalksProvider } from './data/TalksContext'

export function App() {
  return (
    <BrowserRouter>
      <TalksProvider>
        <Routes>
          <Route path="/talk/:id" element={<TalkView />} />
          <Route path="/:year/:month" element={<HomeScreen />} />
          <Route path="/:year" element={<HomeScreen />} />
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </TalksProvider>
    </BrowserRouter>
  )
}
