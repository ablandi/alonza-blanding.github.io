import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newMetric = {
        timestamp: new Date().toLocaleTimeString(),
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 100
      };

      setMetrics(prev => [...prev.slice(-10), newMetric]);
      setLoading(false);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="cyber-card animate-pulse">
        <h2 className="text-xl font-bold text-cyber-yellow mb-4">Loading System Metrics...</h2>
      </div>
    );
  }

  return (
    <div className="cyber-card">
      <h2 className="text-xl font-bold text-cyber-yellow mb-4">System Metrics</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#00fff9"
              tick={{ fill: '#00fff9' }}
            />
            <YAxis 
              stroke="#00fff9"
              tick={{ fill: '#00fff9' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a',
                border: '1px solid #00fff9',
                color: '#00fff9'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="cpu" 
              stroke="#ff00ff" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="memory" 
              stroke="#00fff9" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="network" 
              stroke="#f7f700" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-cyber-pink">CPU</p>
          <p className="text-2xl">{metrics[metrics.length - 1]?.cpu.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-cyber-blue">Memory</p>
          <p className="text-2xl">{metrics[metrics.length - 1]?.memory.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-cyber-yellow">Network</p>
          <p className="text-2xl">{metrics[metrics.length - 1]?.network.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;
