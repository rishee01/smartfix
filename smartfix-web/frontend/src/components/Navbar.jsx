import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">🔧 SmartFix</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">Home</Link>
          <Link to="/report" className="hover:bg-blue-700 px-3 py-2 rounded">Report Issue</Link>
          <Link to="/map" className="hover:bg-blue-700 px-3 py-2 rounded">Map</Link>
          <Link to="/leaderboard" className="hover:bg-blue-700 px-3 py-2 rounded">Leaderboard</Link>
          <Link to="/volunteer" className="hover:bg-blue-700 px-3 py-2 rounded">Volunteer</Link>
        </div>
      </div>
    </nav>
  )
}
