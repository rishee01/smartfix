import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import IssuesTable from './pages/IssuesTable'
import MapView from './pages/MapView'
import Login from './pages/Login'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (!isLoggedIn) {
    return <Login onLogin={() => {
      setIsLoggedIn(true)
      localStorage.setItem('adminToken', 'token-' + Date.now())
    }} />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">🔧 SmartFix Admin</h1>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg ${currentPage === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('issues')}
            className={`w-full text-left px-4 py-3 rounded-lg ${currentPage === 'issues' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            📋 Issues
          </button>
          <button
            onClick={() => setCurrentPage('map')}
            className={`w-full text-left px-4 py-3 rounded-lg ${currentPage === 'map' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            🗺️ Map
          </button>
          <hr className="my-4 border-gray-700" />
          <button
            onClick={() => {
              localStorage.removeItem('adminToken')
              setIsLoggedIn(false)
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'issues' && <IssuesTable />}
          {currentPage === 'map' && <MapView />}
        </div>
      </div>
    </div>
  )
}
