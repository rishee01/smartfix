import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import axios from 'axios'

const severityColors = {
  'High': '#ef4444',
  'Medium': '#f59e0b',
  'Low': '#3b82f6'
}

export default function MapView() {
  const [heatmapData, setHeatmapData] = useState([])
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeatmap()
  }, [])

  const fetchHeatmap = async () => {
    try {
      const response = await axios.get('/api/heatmap')
      setHeatmapData(response.data)
    } catch (error) {
      console.error('Error fetching heatmap:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading map...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🗺️ Heatmap</h1>
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
              <Popup>
                <div>
                  <p className="font-bold">{point.severity} Severity</p>
                  <p className="text-xs">Weight: {point.weight.toFixed(2)}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

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
