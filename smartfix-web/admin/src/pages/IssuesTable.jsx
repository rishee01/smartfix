import { useEffect, useState } from 'react'
import axios from 'axios'

export default function IssuesTable() {
  const [issues, setIssues] = useState([])
  const [sortBy, setSortBy] = useState('created_at')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIssues()
  }, [filterSeverity, filterStatus])

  const fetchIssues = async () => {
    try {
      let query = '/api/reports'
      const params = []
      
      if (filterSeverity !== 'all') {
        params.push(`severity=${filterSeverity}`)
      }
      if (filterStatus !== 'all') {
        params.push(`status=${filterStatus}`)
      }

      if (params.length > 0) {
        query += '?' + params.join('&')
      }

      const response = await axios.get(query)
      setIssues(response.data)
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.post(`/api/admin/report/${id}/status`, { status: newStatus })
      fetchIssues()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const exportCSV = async () => {
    try {
      const response = await axios.get('/api/admin/exports/csv')
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'smartfix-reports.csv')
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  if (loading) return <div className="text-center py-20">Loading issues...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📋 Issues</h1>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Severity</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In-progress">In-progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="created_at">Newest</option>
            <option value="verified_count">Most Verified</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-4 text-left font-semibold">Issue Type</th>
              <th className="px-6 py-4 text-left font-semibold">Description</th>
              <th className="px-6 py-4 text-left font-semibold">Severity</th>
              <th className="px-6 py-4 text-left font-semibold">Department</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Verified</th>
              <th className="px-6 py-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, idx) => (
              <tr key={issue.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 font-semibold capitalize">{issue.label.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{issue.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                    issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {issue.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{issue.department}</td>
                <td className="px-6 py-4">
                  <select
                    value={issue.status}
                    onChange={(e) => updateStatus(issue.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option>Open</option>
                    <option>In-progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4 font-semibold">{issue.verified_count}/3</td>
                <td className="px-6 py-4">
                  <a href={`http://localhost:5173/issue/${issue.id}`} target="_blank" className="text-blue-600 hover:underline text-sm">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {issues.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No issues found</p>
        </div>
      )}
    </div>
  )
}
