export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">🏛️ CivicSense</h1>
          <p className="text-2xl text-gray-600 mb-8">Report civic issues. Help your community. Earn rewards.</p>
          <div className="space-x-4">
            <a href="/report" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Report an Issue
            </a>
            <a href="/map" className="inline-block bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300">
              View Map
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">Snap & Report</h3>
            <p className="text-gray-600">Upload a photo and let our AI identify the issue type.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Community Verify</h3>
            <p className="text-gray-600">Help others by verifying reported issues. Earn points!</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Climb Leaderboard</h3>
            <p className="text-gray-600">Earn badges and compete with other citizens.</p>
          </div>
        </div>

        <div className="mt-20 bg-blue-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">📊 How It Works</h2>
          <ol className="space-y-4 text-gray-700">
            <li><strong>1. Report:</strong> Take a photo of a civic issue (pothole, garbage, water leak, etc.)</li>
            <li><strong>2. Analyze:</strong> Our AI classifies the issue and assigns severity</li>
            <li><strong>3. Share:</strong> Issue is routed to the right department</li>
            <li><strong>4. Verify:</strong> Community members verify the issue exists</li>
            <li><strong>5. Resolve:</strong> Volunteers claim and fix the issue</li>
            <li><strong>6. Reward:</strong> Everyone involved earns points!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
