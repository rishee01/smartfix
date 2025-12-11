import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function IssueDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9))

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/${id}`)
      setReport(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (verified) return
    setVerifying(true)

    try {
      const response = await axios.post(`/api/report/${id}/verify`, { userId })
      setVerified(true)
      // Update report with new verified count and severity
      setReport(prev => ({
        ...prev,
        verified_count: response.data.verified_count,
        severity: response.data.new_severity
      }))
    } catch (error) {
      console.error('Verification error:', error)
      alert('Failed to verify issue')
    } finally {
      setVerifying(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading issue details...</div>
  if (!report) return <div className="text-center py-20">Issue not found</div>

  const severityColor = {
    'Critical': 'text-red-700 bg-red-50 border-red-300',
    'High': 'text-red-600 bg-red-50 border-red-200',
    'Medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Low': 'text-blue-600 bg-blue-50 border-blue-200'
  }

  const severityEmoji = {
    'Critical': '🔴',
    'High': '🔴',
    'Medium': '🟡',
    'Low': '🔵'
  }

  // Progress bar for actionability
  const actionabilityPercentage = report.actionabilityScore || 0

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image */}
        <div className="h-96 bg-gray-200 overflow-hidden">
          <img
            src={report.photo_url}
            alt="Issue"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 capitalize">{report.label.replace(/_/g, ' ')}</h1>
              <p className="text-gray-600 text-lg">{report.description}</p>
            </div>
            <div className={`px-4 py-3 rounded-lg font-bold text-lg border-2 ${severityColor[report.severity]}`}>
              {severityEmoji[report.severity]} {report.severity}
            </div>
          </div>

          {/* Actionability Score */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-700 font-semibold mb-2">📊 Community Engagement Score</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${actionabilityPercentage}%` }}
              />
            </div>
            <p className="text-sm text-purple-600 mt-2 font-semibold">{actionabilityPercentage}% Actionable</p>
          </div>

          {/* Key Information Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="border-l-4 border-blue-600 pl-4 bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-600 uppercase">Department</p>
              <p className="text-lg font-semibold text-gray-800">{report.department}</p>
              {report.escalatedDept && report.escalatedDept !== report.department && (
                <p className="text-xs text-blue-600 mt-1">📢 Escalated</p>
              )}
            </div>

            <div className="border-l-4 border-green-600 pl-4 bg-green-50 p-3 rounded">
              <p className="text-xs text-gray-600 uppercase">Status</p>
              <p className="text-lg font-semibold text-gray-800">{report.status}</p>
            </div>

            <div className="border-l-4 border-orange-600 pl-4 bg-orange-50 p-3 rounded">
              <p className="text-xs text-gray-600 uppercase">Est. Resolution</p>
              <p className="text-lg font-semibold text-gray-800">⏱️ {report.timeToResolve?.text || 'Calculating...'}</p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4 bg-purple-50 p-3 rounded">
              <p className="text-xs text-gray-600 uppercase">AI Confidence</p>
              <p className="text-lg font-semibold text-gray-800">{(report.confidence * 100).toFixed(0)}%</p>
            </div>

            <div className="border-l-4 border-pink-600 pl-4 bg-pink-50 p-3 rounded">
              <p className="text-xs text-gray-600 uppercase">Community Verifications</p>
              <p className="text-lg font-semibold text-gray-800">{report.verified_count} {report.verified_count >= 3 ? '✓' : '/ 3'}</p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4 bg-indigo-50 p-3 rounded">
              <p className="text-xs text-gray-600 uppercase">Reported</p>
              <p className="text-lg font-semibold text-gray-800">{new Date(report.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-semibold">📍 Location Coordinates</p>
            <p className="font-mono text-sm text-gray-800">{report.lat.toFixed(4)}, {report.lon.toFixed(4)}</p>
          </div>

          {/* Verification Status */}
          {report.verified_count < 3 ? (
            <div className="mb-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3 font-semibold">
                ⚠️ This issue needs community verification to be VERIFIED and escalated.
              </p>
              <p className="text-sm text-yellow-700 mb-4">Verifications: {report.verified_count} / 3 needed</p>
              <button
                onClick={handleVerify}
                disabled={verified || verifying}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {verified ? '✅ You Verified This' : verifying ? 'Verifying...' : '✓ Verify This Issue (+2 points)'}
              </button>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <p className="text-green-800 font-bold text-lg">✅ VERIFIED by Community</p>
              <p className="text-green-700 text-sm mt-1">{report.verified_count} community members have verified this issue</p>
            </div>
          )}

          {/* SOS Indicator */}
          {report.is_sos && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-red-800 font-bold text-lg">🚨 EMERGENCY/SOS REPORT</p>
              <p className="text-red-700">⚡ Highest Priority | Immediate Department Escalation</p>
            </div>
          )}

          {/* Confidence Note */}
          {report.confidence < 0.75 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
              ℹ️ AI confidence below 75% - Community verification is especially important
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
