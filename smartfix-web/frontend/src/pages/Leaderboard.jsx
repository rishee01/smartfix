import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard')
      setLeaderboard(response.data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading leaderboard...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
      <p className="text-gray-600 mb-8">Top community members by points</p>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-6 py-4 text-left">Rank</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-right">Points</th>
              <th className="px-6 py-4 text-center">Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => {
              let badge = ''
              if (index === 0) badge = '👑 Gold'
              else if (index === 1) badge = '🥈 Silver'
              else if (index === 2) badge = '🥉 Bronze'

              return (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 font-bold text-lg">{index + 1}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4 text-right font-semibold text-blue-600">{user.points}</td>
                  <td className="px-6 py-4 text-center">{badge}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Report Issue</p>
          <p className="text-2xl font-bold text-blue-600">+10 pts</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Verify Issue</p>
          <p className="text-2xl font-bold text-green-600">+2 pts</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Volunteer Resolves</p>
          <p className="text-2xl font-bold text-purple-600">+20 pts</p>
        </div>
      </div>
    </div>
  )
}
