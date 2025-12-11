import { useEffect, useState } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/admin/metrics')
      setMetrics(response.data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !metrics) return <div className="text-center py-20">Loading metrics...</div>

  const chartData = [
    { name: 'Total Issues', value: metrics.totalReports },
    { name: 'Verified', value: metrics.verifiedReports },
    { name: 'Open', value: metrics.openReports },
    { name: 'SOS Reports', value: metrics.sosReports }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">📊 Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <p className="text-gray-600 text-sm">Total Issues</p>
          <p className="text-4xl font-bold text-blue-600">{metrics.totalReports}</p>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>

        <div className="metric-card">
          <p className="text-gray-600 text-sm">Verified Issues</p>
          <p className="text-4xl font-bold text-green-600">{metrics.verifiedReports}</p>
          <p className="text-xs text-gray-500 mt-2">{((metrics.verifiedReports / metrics.totalReports) * 100).toFixed(0)}% verified</p>
        </div>

        <div className="metric-card">
          <p className="text-gray-600 text-sm">Open Issues</p>
          <p className="text-4xl font-bold text-yellow-600">{metrics.openReports}</p>
          <p className="text-xs text-gray-500 mt-2">Awaiting resolution</p>
        </div>

        <div className="metric-card">
          <p className="text-gray-600 text-sm">SOS Reports</p>
          <p className="text-4xl font-bold text-red-600">{metrics.sosReports}</p>
          <p className="text-xs text-gray-500 mt-2">Emergency priority</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="metric-card">
          <h3 className="text-lg font-bold mb-4">Issues Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-bold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Avg Resolution */}
      <div className="metric-card mt-8">
        <p className="text-gray-600 text-sm">Average Resolution Time</p>
        <p className="text-4xl font-bold text-purple-600">{metrics.avgResolutionHours} hrs</p>
        <p className="text-xs text-gray-500 mt-2">For resolved issues</p>
      </div>
    </div>
  )
}
