import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoaderboard] = useState(true)

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
      setLeaderboard(false)
    }
  }

  // Get badge and tier based on points
  const getBadgeInfo = (points) => {
    if (points >= 500) return { badge: '👑', tier: 'Legend', color: 'bg-yellow-100 border-yellow-400' };
    if (points >= 300) return { badge: '🥇', tier: 'Champion', color: 'bg-orange-100 border-orange-400' };
    if (points >= 150) return { badge: '🥈', tier: 'Elite', color: 'bg-gray-100 border-gray-400' };
    if (points >= 50) return { badge: '🥉', tier: 'Bronze', color: 'bg-amber-100 border-amber-400' };
    return { badge: '⭐', tier: 'Rising Star', color: 'bg-blue-100 border-blue-400' };
  }

  if (loading) return <div className="text-center py-20">Loading leaderboard...</div>

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🏆 Community Leaderboard</h1>
        <p className="text-gray-600 text-lg">Top contributors making our city cleaner and safer</p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length > 0 && (
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 2nd Place */}
            {leaderboard[1] && (
              <div className="col-span-1">
                <div className="bg-gradient-to-b from-gray-300 to-gray-200 rounded-lg p-6 text-center h-80 flex flex-col justify-between border-4 border-gray-400">
                  <div>
                    <p className="text-6xl mb-2">🥈</p>
                    <h3 className="text-2xl font-bold text-gray-800">{leaderboard[1].name}</h3>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-700">{leaderboard[1].points}</p>
                    <p className="text-gray-600 font-semibold">Points</p>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {leaderboard[0] && (
              <div className="col-span-1">
                <div className="bg-gradient-to-b from-yellow-300 to-yellow-100 rounded-lg p-6 text-center h-96 flex flex-col justify-between border-4 border-yellow-400 transform scale-105">
                  <div>
                    <p className="text-8xl mb-2">👑</p>
                    <h3 className="text-3xl font-bold text-yellow-900">{leaderboard[0].name}</h3>
                  </div>
                  <div>
                    <p className="text-5xl font-bold text-yellow-800">{leaderboard[0].points}</p>
                    <p className="text-yellow-700 font-semibold text-lg">Points</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {leaderboard[2] && (
              <div className="col-span-1">
                <div className="bg-gradient-to-b from-amber-600 to-amber-500 rounded-lg p-6 text-center h-80 flex flex-col justify-between border-4 border-amber-700">
                  <div>
                    <p className="text-6xl mb-2">🥉</p>
                    <h3 className="text-2xl font-bold text-white">{leaderboard[2].name}</h3>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-white">{leaderboard[2].points}</p>
                    <p className="text-amber-100 font-semibold">Points</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="px-6 py-4 text-left">Rank</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-center">Tier</th>
              <th className="px-6 py-4 text-right">Points</th>
              <th className="px-6 py-4 text-center">Progress</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => {
              const { badge, tier, color } = getBadgeInfo(user.points);
              const nextTierPoints = index < 3 ? 500 : index < 10 ? 300 : index < 20 ? 150 : 50;
              const progress = Math.min(100, (user.points / nextTierPoints) * 100);

              return (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
                  <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-blue-600">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${color}`}>
                      {badge} {tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-2xl font-bold text-blue-600">{user.points}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{Math.round(progress)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Points System Info */}
      <div className="mt-12 grid md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-gray-600 text-sm font-semibold">📸 Report Issue</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">+10 pts</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-gray-600 text-sm font-semibold">🚨 SOS Emergency</p>
          <p className="text-2xl font-bold text-red-600 mt-1">+25 pts</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
          <p className="text-gray-600 text-sm font-semibold">✓ Verify Issue</p>
          <p className="text-2xl font-bold text-green-600 mt-1">+2 pts</p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
          <p className="text-gray-600 text-sm font-semibold">🔧 Volunteer Resolve</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">+20 pts</p>
        </div>
      </div>

      {/* Tier Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎖️ Achievement Tiers</h3>
        <div className="grid md:grid-cols-5 gap-4 text-sm">
          <div>⭐ Rising Star: 1-49 pts</div>
          <div>🥉 Bronze: 50-149 pts</div>
          <div>🥈 Elite: 150-299 pts</div>
          <div>🥇 Champion: 300-499 pts</div>
          <div>👑 Legend: 500+ pts</div>
        </div>
      </div>
    </div>
  )
}
