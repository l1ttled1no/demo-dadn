import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './SensorCharts.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MAX_DATA_POINTS = 20;

const SensorCharts = ({ historicalData, isConnected }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return `Time: ${context[0].label}`;
          },
          label: (context) => {
            const value = context.raw;
            const unit = context.dataset.label === 'Temperature' ? '°C' : '%';
            return `${context.dataset.label}: ${value}${unit}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}`,
        }
      },
      x: {
        ticks: {
          maxTicksLimit: 8,
          maxRotation: 0,
          minRotation: 0
        },
        grid: {
          display: false
        }
      },
    },
  };

  const createChartData = (sensorData, label, color) => {
    // Ensure we only show the last MAX_DATA_POINTS points
    const limitedData = sensorData.slice(-MAX_DATA_POINTS);
    
    return {
      labels: limitedData.map(d => {
        const date = new Date(d.created_at);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }),
      datasets: [
        {
          label: label,
          data: limitedData.map(d => parseFloat(d.value)),
          borderColor: color,
          backgroundColor: color + '20',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <div className="chart-header">
          <h3>Temperature History</h3>
          <div className={`live-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="live-dot"></span>
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
        <div className="chart">
          <Line 
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales.y,
                  title: {
                    display: true,
                    text: '°C'
                  }
                }
              }
            }} 
            data={createChartData(historicalData.temp || [], 'Temperature', '#FF6B6B')} 
          />
        </div>
      </div>

      <div className="chart-wrapper">
        <div className="chart-header">
          <h3>Humidity History</h3>
          <div className={`live-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="live-dot"></span>
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
        <div className="chart">
          <Line 
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales.y,
                  title: {
                    display: true,
                    text: '%'
                  }
                }
              }
            }} 
            data={createChartData(historicalData.humi || [], 'Humidity', '#4ECDC4')} 
          />
        </div>
      </div>

      <div className="chart-wrapper">
        <div className="chart-header">
          <h3>Light Level History</h3>
          <div className={`live-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="live-dot"></span>
            {isConnected ? 'Live' : 'Offline'}
          </div>
        </div>
        <div className="chart">
          <Line 
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales.y,
                  title: {
                    display: true,
                    text: '%'
                  }
                }
              }
            }} 
            data={createChartData(historicalData['light-level'] || [], 'Light Level', '#FFE66D')} 
          />
        </div>
      </div>
    </div>
  );
};

export default SensorCharts; 