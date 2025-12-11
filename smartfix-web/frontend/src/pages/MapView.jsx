import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

const severityColors = {
  'High': '#ef4444',
  'Medium': '#f59e0b',
  'Low': '#3b82f6'
}

export default function MapView() {
  const [reports, setReports] = useState([])
  const [heatmapData, setHeatmapData] = useState([])
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const [reportsRes, heatmapRes] = await Promise.all([
        axios.get('/api/reports'),
        axios.get('/api/heatmap')
      ])
      setReports(reportsRes.data)
      setHeatmapData(heatmapRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading map...</div>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Issue Map</h1>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
          />
          <span className="font-semibold">Show Heatmap</span>
        </label>
      </div>

      <div className="map-container mb-8">
        <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Heatmap circles */}
          {showHeatmap && heatmapData.map((point, idx) => (
            <CircleMarker
              key={idx}
              center={[point.lat, point.lon]}
              radius={Math.min(point.weight * 5, 30)}
              fillColor={severityColors[point.severity] || '#3b82f6'}
              color={severityColors[point.severity] || '#3b82f6'}
              weight={1}
              opacity={0.7}
              fillOpacity={0.4}
            >
              <Popup>{point.severity} severity</Popup>
            </CircleMarker>
          ))}

          {/* Report markers */}
          {reports.map(report => (
            <Marker key={report.id} position={[report.lat, report.lon]}>
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-bold">{report.label}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <p className="text-xs mt-2">
                    Severity: <span className="font-semibold text-red-600">{report.severity}</span>
                  </p>
                  <p className="text-xs">Verified: {report.verified_count} times</p>
                  <a href={`/issue/${report.id}`} className="text-blue-600 text-sm mt-2 block hover:underline">
                    View Details →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(severityColors).map(([severity, color]) => (
            <div key={severity} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
              <span>{severity} Severity</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
