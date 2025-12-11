import { useEffect, useState } from 'react'
import axios from 'axios'

export default function VolunteerPage() {
  const [issues, setIssues] = useState([])
  const [claimed, setClaimed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await axios.get('/api/reports?status=Open')
      setIssues(response.data)
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const claimIssue = async (issueId) => {
    try {
      const volunteerId = 'vol-' + Math.random().toString(36).substr(2, 9)
      await axios.post(`/api/volunteer/claim/${issueId}`, { volunteerId })
      setClaimed(prev => [...prev, issueId])
      alert('Issue claimed! You earned +0 points (earn +20 when resolved)')
      fetchIssues()
    } catch (error) {
      console.error('Claim error:', error)
      alert('Failed to claim issue')
    }
  }

  if (loading) return <div className="text-center py-20">Loading issues...</div>

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">🙋 Volunteer Portal</h1>
      <p className="text-gray-600 mb-8">Claim open issues and help your community</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
          <p className="text-gray-600">Total Issues to Claim</p>
          <p className="text-3xl font-bold text-blue-600">{issues.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
          <p className="text-gray-600">Issues You've Claimed</p>
          <p className="text-3xl font-bold text-green-600">{claimed.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {issues.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">✅ No open issues to claim! Great job, team.</p>
          </div>
        ) : (
          issues.map(issue => (
            <div key={issue.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold capitalize">{issue.label.replace('_', ' ')}</h3>
                  <p className="text-gray-600">{issue.description}</p>
                </div>
                <span className={`px-4 py-2 rounded-lg font-semibold ${
                  issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                  issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {issue.severity}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Department</p>
                  <p className="font-semibold">{issue.department}</p>
                </div>
                <div>
                  <p className="text-gray-600">Verifications</p>
                  <p className="font-semibold">{issue.verified_count} / 3</p>
                </div>
                <div>
                  <p className="text-gray-600">Est. Resolution</p>
                  <p className="font-semibold">24-48 hrs</p>
                </div>
                <div>
                  <p className="text-gray-600">Reward</p>
                  <p className="font-semibold text-green-600">+20 pts</p>
                </div>
              </div>

              <button
                onClick={() => claimIssue(issue.id)}
                disabled={claimed.includes(issue.id)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {claimed.includes(issue.id) ? '✅ Claimed' : 'Claim This Issue'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">📋 How to Volunteer</h2>
        <ol className="space-y-3 text-gray-700">
          <li><strong>1. Browse</strong> - View all open issues</li>
          <li><strong>2. Claim</strong> - Click to claim an issue</li>
          <li><strong>3. Resolve</strong> - Fix the issue in real life</li>
          <li><strong>4. Upload Proof</strong> - Take a before/after photo (TODO)</li>
          <li><strong>5. Earn</strong> - Get +20 points when resolved!</li>
        </ol>
      </div>
    </div>
  )
}
