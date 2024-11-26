import { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  const cryptoIds = ['bitcoin', 'ethereum', 'solana'];

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
        );
        
        const formattedData = Object.entries(response.data).map(([id, data]) => ({
          id,
          price: data.usd,
          change24h: data.usd_24h_change
        }));
        
        setCryptoData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="cyber-card animate-pulse">
        <h2 className="text-xl font-bold text-cyber-yellow mb-4">Loading Crypto Data...</h2>
      </div>
    );
  }

  return (
    <div className="cyber-card">
      <h2 className="text-xl font-bold text-cyber-yellow mb-4">Crypto Tracker</h2>
      
      <div className="space-y-4">
        {cryptoData.map((crypto) => (
          <div 
            key={crypto.id}
            className="p-4 bg-cyber-dark border border-cyber-blue rounded-lg hover:shadow-neon-blue transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg capitalize">{crypto.id}</h3>
              <span className="text-xl font-mono">
                ${crypto.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            
            <div className="mt-2">
              <span className={`text-sm ${
                crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {crypto.change24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.change24h).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-cyber-blue text-center">
        Data provided by CoinGecko API
      </div>
    </div>
  );
};

export default CryptoTracker;
