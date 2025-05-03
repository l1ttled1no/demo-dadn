import React, { useState, useEffect, useCallback } from 'react';
import { FaTemperatureHigh, FaTint, FaLightbulb, FaDoorOpen, FaFan } from 'react-icons/fa';
import { WiSunrise } from 'react-icons/wi';
import { GiWateringCan } from 'react-icons/gi';
import ServerStatus from './ServerStatus';
import SensorCharts from './SensorCharts';
import './Dashboard.css';

// Adafruit IO Configuration
const ADAFRUIT_CONFIG = {
  username: import.meta.env.VITE_ADAFRUIT_USERNAME,
  key: import.meta.env.VITE_ADAFRUIT_KEY,
  aioUrl: "https://io.adafruit.com/api/v2"
};

const Dashboard = ({ isMinimized }) => {
  const [deviceStates, setDeviceStates] = useState({
    temp: 0,
    humi: 0,
    'light-level': 0,
    'door-button': 0,
    fan: 0,
    'led-button': 0,
    pump: 0
  });
  const [historicalData, setHistoricalData] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const updateHistoricalData = (feed, newValue) => {
    const timestamp = new Date().toISOString();
    setHistoricalData(prev => ({
      ...prev,
      [feed]: [
        ...(prev[feed] || []).slice(-19),
        {
          value: newValue,
          created_at: timestamp
        }
      ]
    }));
  };

  const getFanSpeedLabel = (value) => {
    const speed = parseInt(value);
    switch (speed) {
      case 0: return 'OFF';
      case 1: return 'Speed 1';
      case 2: return 'Speed 2';
      case 3: return 'Speed 3';
      default: return 'OFF';
    }
  };

  const getDoorStatus = (value) => {
    const status = parseInt(value);
    return {
      mainStatus: status > 0 ? 'Open' : 'Closed',
      subStatus: status === 99 ? 'Face Recognition' : status === 1 ? 'App Control' : null
    };
  };

  const fetchData = useCallback(async () => {
    try {
      const feedsResponse = await fetch(
        `${ADAFRUIT_CONFIG.aioUrl}/${ADAFRUIT_CONFIG.username}/feeds`,
        {
          headers: {
            'X-AIO-Key': ADAFRUIT_CONFIG.key,
          },
        }
      );

      if (!feedsResponse.ok) {
        throw new Error('Failed to fetch feeds');
      }

      const feeds = await feedsResponse.json();
      const newStates = { ...deviceStates };
      
      await Promise.all(
        feeds.map(async (feed) => {
          try {
            const dataResponse = await fetch(
              `${ADAFRUIT_CONFIG.aioUrl}/${ADAFRUIT_CONFIG.username}/feeds/${feed.key}/data/last`,
              {
                headers: {
                  'X-AIO-Key': ADAFRUIT_CONFIG.key,
                },
              }
            );

            if (dataResponse.ok) {
              const data = await dataResponse.json();
              newStates[feed.key] = parseFloat(data.value) || 0;
            }
          } catch (error) {
            console.error(`Error fetching data for ${feed.key}:`, error);
          }
        })
      );

      setDeviceStates(newStates);
      setLastUpdate(new Date());
      setIsConnected(true);

      await fetchHistoricalData();
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsConnected(false);
    }
  }, [deviceStates]);

  const handleFanSpeed = async (speed) => {
    try {
      const response = await fetch(
        `${ADAFRUIT_CONFIG.aioUrl}/${ADAFRUIT_CONFIG.username}/feeds/fan/data`,
        {
          method: 'POST',
          headers: {
            'X-AIO-Key': ADAFRUIT_CONFIG.key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: speed }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update fan speed');
      }

      // Verify the update by fetching the current state
      const verifyResponse = await fetch(
        `${ADAFRUIT_CONFIG.aioUrl}/${ADAFRUIT_CONFIG.username}/feeds/fan/data/last`,
        {
          headers: {
            'X-AIO-Key': ADAFRUIT_CONFIG.key,
          },
        }
      );

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify fan speed update');
      }

      const data = await verifyResponse.json();
      const serverSpeed = parseInt(data.value);

      // Update local state with the verified server state
      setDeviceStates(prev => ({
        ...prev,
        fan: serverSpeed
      }));
      setLastUpdate(new Date());

      // If the server state doesn't match what we tried to set, throw an error
      if (serverSpeed !== parseInt(speed)) {
        throw new Error('Server state does not match requested state');
      }
    } catch (error) {
      console.error('Error updating fan speed:', error);
      // On any error, fetch the current state from the server
      fetchData();
    }
  };

  const toggleDevice = async (device) => {
    try {
      let newValue;
      
      // Special handling for door
      if (device === 'door-button') {
        // If door is open (either by app or face), close it
        // If door is closed, open it via app
        newValue = deviceStates[device] > 0 ? 0 : 1;
      } else {
        // Normal toggle for other devices
        newValue = deviceStates[device] === 0 ? 1 : 0;
      }

      const response = await fetch(
        `${ADAFRUIT_CONFIG.aioUrl}/${ADAFRUIT_CONFIG.username}/feeds/${device}/data`,
        {
          method: 'POST',
          headers: {
            'X-AIO-Key': ADAFRUIT_CONFIG.key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: newValue }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to toggle ${device}`);
      }

      // Update local state immediately for better UX
      setDeviceStates(prev => ({
        ...prev,
        [device]: newValue
      }));
      setLastUpdate(new Date());

      // Verify the update after a short delay
      setTimeout(async () => {
        try {
          const verifyResponse = await fetch(
            `${ADAFRUIT_CONFIG.aioUrl}/${ADAFRUIT_CONFIG.username}/feeds/${device}/data/last`,
            {
              headers: {
                'X-AIO-Key': ADAFRUIT_CONFIG.key,
              },
            }
          );

          if (verifyResponse.ok) {
            const data = await verifyResponse.json();
            const serverValue = parseFloat(data.value);
            
            // Update local state if it doesn't match server
            if (serverValue !== newValue) {
              setDeviceStates(prev => ({
                ...prev,
                [device]: serverValue
              }));
            }
          }
        } catch (error) {
          console.error(`Error verifying ${device} state:`, error);
        }
      }, 1000);
    } catch (error) {
      console.error(`Error toggling ${device}:`, error);
      // Fetch current state from server on error
      fetchData();
    }
  };

  const sensorCards = [
    {
      title: 'Temperature',
      value: `${deviceStates.temp.toFixed(1)}°C`,
      icon: <FaTemperatureHigh />,
      color: '#FF6B6B',
      colorRgb: '255, 107, 107',
      isControl: false
    },
    {
      title: 'Humidity',
      value: `${deviceStates.humi.toFixed(1)}%`,
      icon: <FaTint />,
      color: '#4ECDC4',
      colorRgb: '78, 205, 196',
      isControl: false
    },
    {
      title: 'Light Level',
      value: `${deviceStates['light-level']}%`,
      icon: <WiSunrise />,
      color: '#FFE66D',
      colorRgb: '255, 230, 109',
      isControl: false
    }
  ];

  const controlCards = [
    {
      title: 'Door',
      value: getDoorStatus(deviceStates['door-button']),
      icon: <FaDoorOpen />,
      color: '#1488D8',
      colorRgb: '20, 136, 216',
      isControl: true,
      device: 'door-button',
      description: deviceStates['door-button'] === 0 
        ? 'Click to open'
        : deviceStates['door-button'] === 99 
          ? 'Opened via face recognition'
          : 'Click to close'
    },
    {
      title: 'Fan Control',
      value: getFanSpeedLabel(deviceStates.fan),
      icon: <FaFan style={{
        animation: deviceStates.fan > 0 ? `spin ${2/deviceStates.fan}s linear infinite` : 'none'
      }} />,
      color: '#95A5A6',
      colorRgb: '149, 165, 166',
      isControl: true,
      device: 'fan',
      isSpeedControl: true,
      currentSpeed: deviceStates.fan,
      speedOptions: [
        { value: 0, label: 'OFF' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' }
      ],
    },
    {
      title: 'LED',
      value: deviceStates['led-button'] === 1 ? 'On' : 'Off',
      icon: <FaLightbulb />,
      color: '#E74C3C',
      colorRgb: '231, 76, 60',
      isControl: true,
      device: 'led-button'
    },
    {
      title: 'Pump',
      value: deviceStates.pump === 1 ? 'On' : 'Off',
      icon: <GiWateringCan />,
      color: '#2ECC71',
      colorRgb: '46, 204, 113',
      isControl: true,
      device: 'pump'
    }
  ];

  const fetchHistoricalData = async () => {
    try {
      const sensorFeeds = ['temp', 'humi', 'light-level'];
      const newHistoricalData = {};

      await Promise.all(
        sensorFeeds.map(async (feed) => {
          const response = await fetch(
            `${ADAFRUIT_CONFIG.aioUrl}/${ADAFRUIT_CONFIG.username}/feeds/${feed}/data?limit=20`,
            {
              headers: {
                'X-AIO-Key': ADAFRUIT_CONFIG.key,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            newHistoricalData[feed] = data.reverse();
          }
        })
      );

      setHistoricalData(newHistoricalData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  useEffect(() => {
    const savedInterval = localStorage.getItem('refreshInterval');
    if (savedInterval) {
      setRefreshInterval(parseInt(savedInterval));
    }

    fetchData();

    const setupWebSocket = () => {
      const ws = new WebSocket('wss://io.adafruit.com/websocket');

      ws.onopen = () => {
        console.log('Connected to Adafruit IO WebSocket');
        setIsConnected(true);
        ws.send(JSON.stringify({
          action: 'authenticate',
          username: ADAFRUIT_CONFIG.username,
          key: ADAFRUIT_CONFIG.key
        }));

        const feeds = ['temp', 'humi', 'light-level', 'door-button', 'fan', 'led-button', 'pump'];
        feeds.forEach(feed => {
          ws.send(JSON.stringify({
            action: 'subscribe',
            feed: `${ADAFRUIT_CONFIG.username}/feeds/${feed}`
          }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.value) {
            const feedName = data.feed.split('/').pop();
            const value = parseFloat(data.value);
            
            setDeviceStates(prev => ({
              ...prev,
              [feedName]: value
            }));

            if (['temp', 'humi', 'light-level'].includes(feedName)) {
              updateHistoricalData(feedName, value);
            }

            setLastUpdate(new Date());
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from Adafruit IO WebSocket');
        setIsConnected(false);
        setTimeout(setupWebSocket, 5000);
      };

      return ws;
    };

    const ws = setupWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, refreshInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchData]);

  // Add real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format the date and time
  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className={`dashboard-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="dashboard-header">
        <h1>Smart Home Dashboard</h1>
        <p>Real-time monitoring and control of your home devices</p>
        <div className="refresh-controls">
          <div className="auto-refresh">Auto-refresh every {refreshInterval} minutes</div>
          <button 
            className="refresh-button" 
            onClick={fetchData}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
            </svg>
            Refresh Now
          </button>
        </div>
      </div>

      <div className="current-time">
        {formatDateTime(currentTime)}
      </div>

      <div className="dashboard-content">
        <section className="sensors-section">
          <h2>Sensor Readings</h2>
          <div className="stats-grid sensors-grid">
            {sensorCards.map((card, index) => (
              <div 
                className="stat-card"
                key={index} 
                style={{ 
                  '--card-color': card.color,
                  '--card-color-rgb': card.colorRgb
                }}
              >
                <div className="stat-icon" style={{ backgroundColor: `${card.color}15` }}>
                  {card.icon}
                </div>
                <div className="stat-info">
                  <h3>{card.title}</h3>
                  <p className="stat-value">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="controls-section">
          <h2>Device Controls</h2>
          <div className="stats-grid controls-grid">
            {controlCards.map((card, index) => (
              <div 
                className={`stat-card ${card.isSpeedControl ? 'speed-control' : 'clickable'}`}
                key={index} 
                style={{ 
                  '--card-color': card.color,
                  '--card-color-rgb': card.colorRgb,
                  '--fan-speed': card.currentSpeed || 1
                }}
                onClick={!card.isSpeedControl ? () => toggleDevice(card.device) : undefined}
                data-device={card.device}
              >
                <div className="stat-icon" style={{ backgroundColor: `${card.color}15` }}>
                  {card.icon}
                </div>
                <div className="stat-info">
                  <h3>{card.title}</h3>
                  {typeof card.value === 'object' ? (
                    <div className="status-container">
                      <p className="stat-value">{card.value.mainStatus}</p>
                      {card.value.subStatus && (
                        <p className="stat-sub-status">{card.value.subStatus}</p>
                      )}
                    </div>
                  ) : (
                    <p className="stat-value">
                      {card.isSpeedControl ? `Speed: ${card.value}` : card.value}
                    </p>
                  )}
                  {card.description && (
                    <p className="stat-description">{card.description}</p>
                  )}
                  {card.isSpeedControl && (
                    <div className="speed-control-wrapper">
                      <div className="speed-slider">
                        <div 
                          className="speed-indicator" 
                          style={{
                            width: `${(parseInt(card.currentSpeed) / 3) * 100}%`,
                            left: '0'
                          }}
                        />
                        {card.speedOptions.map((option) => (
                          <div
                            key={option.value}
                            className={`speed-section ${parseInt(card.currentSpeed) === option.value ? 'active' : ''}`}
                            onClick={() => handleFanSpeed(option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <SensorCharts historicalData={historicalData} isConnected={isConnected} />
      </div>

      <ServerStatus isConnected={isConnected} lastUpdate={lastUpdate} />
    </div>
  );
};

export default Dashboard; 