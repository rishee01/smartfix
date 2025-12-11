import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    description: '',
    latitude: null,
    longitude: null,
    photo: null,
    isAnonymous: false,
    isSOS: false
  })
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9))
  const [inferResult, setInferResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverResponse, setServerResponse] = useState(null)

  // Get user location on mount
  useEffect(() => {
    getLocation()
  }, [])

  // Get user location
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }))
      })
    }
  }

  // Handle file selection and inference
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFormData(prev => ({ ...prev, photo: file }))
    setLoading(true)

    try {
      const formDataForInfer = new FormData()
      formDataForInfer.append('photo', file)

      const response = await axios.post('/api/infer', formDataForInfer)
      setInferResult(response.data)
    } catch (error) {
      console.error('Inference error:', error)
      alert('AI analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Submit report
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inferResult) {
      alert('Please upload a photo first')
      return
    }

    setLoading(true)
    try {
      const reportFormData = new FormData()
      reportFormData.append('description', formData.description)
      reportFormData.append('lat', formData.latitude || 28.6139)
      reportFormData.append('lon', formData.longitude || 77.2090)
      reportFormData.append('label', inferResult.label)
      reportFormData.append('confidence', inferResult.confidence)
      reportFormData.append('isAnonymous', formData.isAnonymous)
      reportFormData.append('isSOS', formData.isSOS)
      reportFormData.append('userId', formData.isAnonymous ? null : userId)
      if (formData.photo) reportFormData.append('photo', formData.photo)

      const response = await axios.post('/api/report', reportFormData)
      setServerResponse(response.data)
      setSuccess(true)
      setTimeout(() => window.location.href = '/map', 2500)
    } catch (error) {
      console.error('Report error:', error)
      alert('Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
      <p className="text-gray-600 mb-8">Help improve your community by reporting civic issues</p>

      {success && (
        <div className="mb-8 p-4 bg-green-100 text-green-800 rounded-lg border-l-4 border-green-600">
          <p className="font-bold">✅ Issue reported successfully!</p>
          {serverResponse && (
            <>
              <p className="text-sm mt-2">🎯 Severity: <strong>{serverResponse.severity}</strong></p>
              <p className="text-sm">🏢 Department: <strong>{serverResponse.department}</strong></p>
              {!formData.isAnonymous && <p className="text-sm">🎖️ +10 points earned!</p>}
            </>
          )}
          <p className="text-sm mt-2">Redirecting to map...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
        
        {/* Photo Upload */}
        <div>
          <label className="block text-lg font-semibold mb-2">📸 Upload Photo</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={loading}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
              required
            />
          </div>
          {loading && <p className="text-blue-600 text-sm mt-2">🤖 Analyzing image with AI...</p>}
          {inferResult && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-900">✓ AI Analysis Complete:</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-gray-700">Issue Type: <strong className="text-blue-600">{inferResult.label.replace('_', ' ').toUpperCase()}</strong></p>
                <p className="text-gray-700">Confidence: <strong className="text-blue-600">{(inferResult.confidence * 100).toFixed(0)}%</strong></p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold mb-2">📝 Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the issue in detail (location details, severity, etc.)..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows="4"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-lg font-semibold mb-3">📍 Location</label>
          <button
            type="button"
            onClick={getLocation}
            className="mb-3 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 border border-gray-300"
          >
            📡 Use Current Location
          </button>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Latitude</label>
              <input
                type="number"
                value={formData.latitude || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                step="0.0001"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Longitude</label>
              <input
                type="number"
                value={formData.longitude || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                step="0.0001"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-3 font-semibold text-gray-700">Report Anonymously</span>
            <span className="ml-2 text-xs text-gray-500">(no points earned)</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isSOS}
              onChange={(e) => setFormData(prev => ({ ...prev, isSOS: e.target.checked }))}
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="ml-3 font-semibold text-gray-700">🚨 SOS / Emergency</span>
            <span className="ml-2 text-xs text-red-500">(+25 points, highest priority)</span>
          </label>
        </div>

        {/* Points Info */}
        {!formData.isAnonymous && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <p className="text-yellow-800">🎖️ <strong>You'll earn {formData.isSOS ? '25' : '10'} points</strong> for this report (if verified)</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !inferResult}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg"
        >
          {loading ? '⏳ Submitting...' : '✓ Submit Report'}
        </button>
      </form>
    </div>
  )
}
