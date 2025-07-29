import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, MessageCircle, TrendingUp, Heart, Brain } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ onBack }) => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    setJournalEntries(entries);
    setChatMessages(messages);
  }, []);

  const getMoodData = () => {
    const moodCounts = {
      excellent: 0,
      good: 0,
      okay: 0,
      sad: 0,
      anxious: 0
    };

    const moodColors = {
      excellent: '#10b981',
      good: '#3b82f6',
      okay: '#f59e0b',
      sad: '#ef4444',
      anxious: '#8b5cf6'
    };

    const moodLabels = {
      excellent: 'Excellent',
      good: 'Good',
      okay: 'Okay',
      sad: 'Sad',
      anxious: 'Anxious'
    };

    journalEntries.forEach(entry => {
      if (moodCounts.hasOwnProperty(entry.mood)) {
        moodCounts[entry.mood]++;
      }
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      color: moodColors[mood],
      label: moodLabels[mood],
      percentage: journalEntries.length > 0 ? (count / journalEntries.length) * 100 : 0
    }));
  };

  const getWeeklyMoodTrend = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEntries = journalEntries.filter(entry => entry.date === dateStr);
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => {
            const moodValues = { excellent: 5, good: 4, okay: 3, sad: 2, anxious: 1 };
            return sum + (moodValues[entry.mood] || 3);
          }, 0) / dayEntries.length
        : 0;

      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        mood: avgMood,
        entries: dayEntries.length
      });
    }
    
    return last7Days;
  };

  const getStats = () => {
    const totalEntries = journalEntries.length;
    const totalMessages = chatMessages.filter(msg => msg.sender === 'user').length;
    const streakDays = calculateStreak();
    const avgMood = journalEntries.length > 0 
      ? journalEntries.reduce((sum, entry) => {
          const moodValues = { excellent: 5, good: 4, okay: 3, sad: 2, anxious: 1 };
          return sum + (moodValues[entry.mood] || 3);
        }, 0) / journalEntries.length
      : 0;

    return { totalEntries, totalMessages, streakDays, avgMood };
  };

  const calculateStreak = () => {
    if (journalEntries.length === 0) return 0;
    
    const sortedEntries = journalEntries
      .map(entry => entry.date)
      .sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = currentDate.toISOString().split('T')[0];
      if (sortedEntries.includes(entryDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const moodData = getMoodData();
  const weeklyTrend = getWeeklyMoodTrend();
  const stats = getStats();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="dashboard-title">Analytics Dashboard</h1>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalEntries}</div>
              <div className="stat-label">Journal Entries</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <MessageCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalMessages}</div>
              <div className="stat-label">Chat Messages</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.streakDays}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Heart size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.avgMood.toFixed(1)}</div>
              <div className="stat-label">Avg Mood</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Mood Distribution */}
          <div className="chart-card">
            <h3 className="chart-title">
              <BarChart3 size={20} />
              Mood Distribution
            </h3>
            <div className="mood-chart">
              {moodData.map((item) => (
                <div key={item.mood} className="mood-bar-container">
                  <div className="mood-bar-label">
                    <span className="mood-emoji">
                      {item.mood === 'excellent' && '😄'}
                      {item.mood === 'good' && '😊'}
                      {item.mood === 'okay' && '😐'}
                      {item.mood === 'sad' && '😢'}
                      {item.mood === 'anxious' && '😰'}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div className="mood-bar-track">
                    <div 
                      className="mood-bar-fill"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                  <div className="mood-bar-count">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="chart-card">
            <h3 className="chart-title">
              <TrendingUp size={20} />
              Weekly Mood Trend
            </h3>
            <div className="trend-chart">
              {weeklyTrend.map((day, index) => (
                <div key={index} className="trend-day">
                  <div className="trend-bar-container">
                    <div 
                      className="trend-bar"
                      style={{ 
                        height: `${(day.mood / 5) * 100}%`,
                        backgroundColor: day.mood > 3.5 ? '#10b981' : 
                                       day.mood > 2.5 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                  <div className="trend-day-label">{day.day}</div>
                  <div className="trend-entries-count">{day.entries}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-grid">
            <div className="activity-card">
              <h4>Latest Journal Entry</h4>
              {journalEntries.length > 0 ? (
                <div className="activity-item">
                  <div className="activity-date">
                    {new Date(journalEntries[0].date).toLocaleDateString()}
                  </div>
                  <div className="activity-content">
                    {journalEntries[0].content.substring(0, 100)}...
                  </div>
                </div>
              ) : (
                <div className="no-activity">No journal entries yet</div>
              )}
            </div>

            <div className="activity-card">
              <h4>Chat Activity</h4>
              {chatMessages.length > 0 ? (
                <div className="activity-item">
                  <div className="activity-date">
                    {new Date(chatMessages[chatMessages.length - 1].timestamp).toLocaleDateString()}
                  </div>
                  <div className="activity-content">
                    Last conversation with AI companion
                  </div>
                </div>
              ) : (
                <div className="no-activity">No chat messages yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;