import { useState } from 'react'
import SystemMetrics from './components/SystemMetrics'
import CryptoTracker from './components/CryptoTracker'
import WeatherMatrix from './components/WeatherMatrix'

function App() {
  return (
    <div className="min-h-screen bg-cyber-dark p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-cyber-pink mb-2">
          NetRunner Dashboard
        </h1>
        <p className="text-cyber-blue">Real-time system monitoring and data visualization</p>
      </header>

      <main className="cyber-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <SystemMetrics />
        <CryptoTracker />
        <WeatherMatrix />
      </main>

      <footer className="mt-8 text-center text-cyber-blue">
        <p>&copy; 2024 NetRunner Dashboard | Cyberpunk Data Visualization</p>
      </footer>
    </div>
  )
}

export default App
