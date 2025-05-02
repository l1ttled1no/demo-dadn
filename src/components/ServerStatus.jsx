import React from 'react';
import './ServerStatus.css';

const ServerStatus = ({ isConnected, lastUpdate }) => {
  return (
    <div className="server-status">
      <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-dot"></div>
        <span className="status-text">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {lastUpdate && (
        <div className="last-update">
          Last update: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ServerStatus; 