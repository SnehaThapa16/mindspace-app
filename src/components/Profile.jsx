import React, { useState, useEffect } from 'react';
import { User, Settings, Download, Trash2, Moon, Sun, Globe, Save } from 'lucide-react';
import './Profile.css';

const Profile = ({ onBack }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    joinDate: new Date().toISOString()
  });
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    dataBackup: true
  });
  const [stats, setStats] = useState({
    journalEntries: 0,
    chatMessages: 0,
    daysActive: 0,
    favoritesTips: 0
  });

  useEffect(() => {
    loadUserData();
    calculateStats();
  }, []);

  const loadUserData = () => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    setProfile({
      name: savedProfile.name || 'Anonymous User',
      email: savedProfile.email || '',
      avatar: savedProfile.avatar || '',
      joinDate: savedProfile.joinDate || new Date().toISOString()
    });
    
    setSettings({
      theme: savedSettings.theme || 'light',
      language: savedSettings.language || 'en',
      notifications: savedSettings.notifications !== false,
      dataBackup: savedSettings.dataBackup !== false
    });
  };

  const calculateStats = () => {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const favoriteTips = JSON.parse(localStorage.getItem('favoriteTips') || '[]');
    
    // Calculate days active based on unique dates in journal entries
    const uniqueDates = [...new Set(journalEntries.map(entry => entry.date))];
    
    setStats({
      journalEntries: journalEntries.length,
      chatMessages: chatMessages.filter(msg => msg.sender === 'user').length,
      daysActive: uniqueDates.length,
      favoritesTips: favoriteTips.length
    });
  };

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Profile saved successfully!');
  };

  const exportData = () => {
    const data = {
      profile,
      settings,
      journalEntries: JSON.parse(localStorage.getItem('journalEntries') || '[]'),
      chatMessages: JSON.parse(localStorage.getItem('chatMessages') || '[]'),
      favoriteTips: JSON.parse(localStorage.getItem('favoriteTips') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindspace-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAllData = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      if (confirm('This will delete all your journal entries, chat messages, and settings. Are you absolutely sure?')) {
        localStorage.removeItem('journalEntries');
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('favoriteTips');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userSettings');
        localStorage.removeItem('dailyTip');
        localStorage.removeItem('dailyTipDate');
        
        // Reset state
        setProfile({
          name: 'Anonymous User',
          email: '',
          avatar: '',
          joinDate: new Date().toISOString()
        });
        setSettings({
          theme: 'light',
          language: 'en',
          notifications: true,
          dataBackup: true
        });
        setStats({
          journalEntries: 0,
          chatMessages: 0,
          daysActive: 0,
          favoritesTips: 0
        });
        
        alert('All data has been reset successfully.');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="profile-title">Profile & Settings</h1>
      </div>

      <div className="profile-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="section-header">
            <User size={24} />
            <h2>Profile Information</h2>
          </div>
          
          <div className="profile-card">
            <div className="avatar-section">
              <div className="avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <div className="avatar-info">
                <h3>{profile.name}</h3>
                <p>Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="profile-form">
              <div className="form-grp">
                <label>Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="form-grp">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h2>Your Journey</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.journalEntries}</div>
              <div className="stat-label">Journal Entries</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.chatMessages}</div>
              <div className="stat-label">Chat Messages</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.daysActive}</div>
              <div className="stat-label">Days Active</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.favoritesTips}</div>
              <div className="stat-label">Favorite Tips</div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="settings-section">
          <div className="section-header">
            <Settings size={24} />
            <h2>Settings</h2>
          </div>
          
          <div className="settings-card">

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <Globe size={20} />
                </div>
                <div>
                  <h4>Language</h4>
                  <p>Select your language preference</p>
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="en">English</option>

              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <Settings size={20} />
                </div>
                <div>
                  <h4>Notifications</h4>
                  <p>Receive daily reminders and tips</p>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <Download size={20} />
                </div>
                <div>
                  <h4>Auto Backup</h4>
                  <p>Automatically backup your data</p>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.dataBackup}
                  onChange={(e) => handleSettingChange('dataBackup', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="actions-section">
          <h2>Data Management</h2>
          <div className="actions-grid">
            <button className="action-btn save" onClick={saveProfile}>
              <Save size={20} />
              Save Changes
            </button>
            
            <button className="action-btn export" onClick={exportData}>
              <Download size={20} />
              Export Data
            </button>
            
            <button className="action-btn danger" onClick={resetAllData}>
              <Trash2 size={20} />
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;