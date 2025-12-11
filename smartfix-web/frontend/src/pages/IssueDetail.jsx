import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function IssueDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

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
      const userId = 'user-' + Math.random().toString(36).substr(2, 9)
      await axios.post(`/api/report/${id}/verify`, { userId })
      setVerified(true)
      fetchReport() // Refresh data
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
    'High': 'text-red-600',
    'Medium': 'text-yellow-600',
    'Low': 'text-blue-600'
  }

  const severityBg = {
    'High': 'bg-red-100',
    'Medium': 'bg-yellow-100',
    'Low': 'bg-blue-100'
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image */}
        <div className="h-96 bg-gray-200">
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
              <h1 className="text-4xl font-bold mb-2 capitalize">{report.label.replace('_', ' ')}</h1>
              <p className="text-gray-600">{report.description}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${severityColor[report.severity]} ${severityBg[report.severity]}`}>
              {report.severity}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-600">Department</p>
              <p className="text-lg font-semibold">{report.department}</p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold">{report.status}</p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <p className="text-sm text-gray-600">AI Confidence</p>
              <p className="text-lg font-semibold">{(report.confidence * 100).toFixed(0)}%</p>
            </div>

            <div className="border-l-4 border-orange-600 pl-4">
              <p className="text-sm text-gray-600">Estimated Resolution</p>
              <p className="text-lg font-semibold">{report.timeToResolve?.text || 'Calculating...'}</p>
            </div>

            <div className="border-l-4 border-pink-600 pl-4">
              <p className="text-sm text-gray-600">Community Verifications</p>
              <p className="text-lg font-semibold">{report.verified_count} / 3 needed</p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4">
              <p className="text-sm text-gray-600">Reported</p>
              <p className="text-lg font-semibold">{new Date(report.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Location Coordinates</p>
            <p className="font-mono text-sm">{report.lat.toFixed(4)}, {report.lon.toFixed(4)}</p>
          </div>

          {/* Verification Status */}
          {report.verified_count < 3 ? (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                ⚠️ This issue needs community verification to be marked as VERIFIED.
              </p>
              <button
                onClick={handleVerify}
                disabled={verified || verifying}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {verified ? '✅ You Verified This' : verifying ? 'Verifying...' : 'Verify This Issue (+2 points)'}
              </button>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">✅ This issue is VERIFIED by the community</p>
            </div>
          )}

          {/* SOS Indicator */}
          {report.is_sos ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-bold">🚨 This is an SOS/Emergency Report</p>
              <p className="text-red-700 text-sm">Priority: HIGHEST</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
