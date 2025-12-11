import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import ReportIssue from './pages/ReportIssue'
import MapView from './pages/MapView'
import IssueDetail from './pages/IssueDetail'
import Leaderboard from './pages/Leaderboard'
import VolunteerPage from './pages/VolunteerPage'

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/issue/:id" element={<IssueDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
      </Routes>
    </Router>
  )
}
