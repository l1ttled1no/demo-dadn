import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaBell, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import './Settings.css';

const Settings = ({ isMinimized }) => {
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [notifications, setNotifications] = useState({
    critical: true,
    deviceStatus: true,
    maintenance: false,
    updates: false
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedInterval = localStorage.getItem('refreshInterval');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedInterval) setRefreshInterval(parseInt(savedInterval));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  const handleSave = () => {
    localStorage.setItem('refreshInterval', refreshInterval);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnsavedChanges(false);
    navigate('/');
  };

  const handleCancel = () => {
    if (unsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleChange = (type, value) => {
    setUnsavedChanges(true);
    switch (type) {
      case 'refreshInterval':
        setRefreshInterval(parseInt(value));
        break;
      case 'notifications':
        setNotifications(prev => ({
          ...prev,
          [value]: !prev[value]
        }));
        break;
      default:
        break;
    }
  };

  return (
    <div className={`settings-page ${isMinimized ? 'minimized' : ''}`}>
      <div className="settings-header">
        <button className="back-button" onClick={handleCancel}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="header-content">
          <h1><FaCog className="settings-icon" /> Settings</h1>
          <div className="header-actions">
            {unsavedChanges && (
              <span className="unsaved-changes">You have unsaved changes</span>
            )}
            <div className="button-group">
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className={`save-button ${unsavedChanges ? 'highlight' : ''}`}
                disabled={!unsavedChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-grid">
          <div className="settings-section">
            <h2><FaChartLine /> Dashboard Configuration</h2>
            <div className="setting-item">
              <label htmlFor="refreshInterval">Data Refresh Interval</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  id="refreshInterval"
                  min="1"
                  max="60"
                  value={refreshInterval}
                  onChange={(e) => handleChange('refreshInterval', e.target.value)}
                />
                <span className="unit">minutes</span>
              </div>
              <p className="setting-description">
                Set how often the dashboard should refresh data from Adafruit IO (1-60 minutes)
              </p>
            </div>
          </div>

          <div className="settings-section">
            <h2><FaBell /> Notifications</h2>
            <div className="setting-item">
              <div className="notification-group">
                <label className="notification-label">
                  <input
                    type="checkbox"
                    checked={notifications.critical}
                    onChange={() => handleChange('notifications', 'critical')}
                  />
                  <div className="notification-content">
                    <span className="notification-title">Critical Alerts</span>
                    <p className="notification-description">
                      Get immediate notifications for critical system events and security alerts
                    </p>
                  </div>
                </label>

                <label className="notification-label">
                  <input
                    type="checkbox"
                    checked={notifications.deviceStatus}
                    onChange={() => handleChange('notifications', 'deviceStatus')}
                  />
                  <div className="notification-content">
                    <span className="notification-title">Device Status Changes</span>
                    <p className="notification-description">
                      Receive alerts when devices turn on/off or change states
                    </p>
                  </div>
                </label>

                <label className="notification-label">
                  <input
                    type="checkbox"
                    checked={notifications.maintenance}
                    onChange={() => handleChange('notifications', 'maintenance')}
                  />
                  <div className="notification-content">
                    <span className="notification-title">Maintenance Alerts</span>
                    <p className="notification-description">
                      Get notified about required system maintenance and device checkups
                    </p>
                  </div>
                </label>

                <label className="notification-label">
                  <input
                    type="checkbox"
                    checked={notifications.updates}
                    onChange={() => handleChange('notifications', 'updates')}
                  />
                  <div className="notification-content">
                    <span className="notification-title">System Updates</span>
                    <p className="notification-description">
                      Receive notifications about system updates and new features
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 