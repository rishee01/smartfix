import { useState } from 'react'
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
  const [inferResult, setInferResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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
      if (formData.photo) reportFormData.append('photo', formData.photo)

      await axios.post('/api/report', reportFormData)
      setSuccess(true)
      setTimeout(() => window.location.href = '/map', 2000)
    } catch (error) {
      console.error('Report error:', error)
      alert('Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Report an Issue</h1>

      {success && (
        <div className="mb-8 p-4 bg-green-100 text-green-800 rounded-lg">
          ✅ Issue reported successfully! Redirecting to map...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
        
        {/* Photo Upload */}
        <div>
          <label className="block text-lg font-semibold mb-2">📸 Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={loading}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg"
            required
          />
          {inferResult && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold">🤖 AI Analysis:</p>
              <p className="text-gray-700">Issue Type: <strong>{inferResult.label}</strong></p>
              <p className="text-gray-700">Confidence: <strong>{(inferResult.confidence * 100).toFixed(0)}%</strong></p>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold mb-2">📝 Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the issue in detail..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows="4"
            required
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold mb-2">📍 Latitude</label>
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
            <label className="block text-lg font-semibold mb-2">📍 Longitude</label>
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

        <button
          type="button"
          onClick={getLocation}
          className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
        >
          📡 Use Current Location
        </button>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
              className="mr-2"
            />
            <span className="font-semibold">Report Anonymously</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isSOS}
              onChange={(e) => setFormData(prev => ({ ...prev, isSOS: e.target.checked }))}
              className="mr-2"
            />
            <span className="font-semibold">🚨 SOS / Emergency (Auto-High Priority)</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !inferResult}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  )
}
