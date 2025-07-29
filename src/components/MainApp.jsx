import React, { useState } from 'react';
import { BookOpen, MessageCircle, BarChart3, Lightbulb, User, LogOut } from 'lucide-react';
import JournalEntry from './JournalEntry';
import ChatBot from './ChatBot';
import Dashboard from './Dashboard';
import Tips from './Tips';
import Profile from './Profile';
import './MainApp.css';

const MainApp = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('home');

  const renderActiveView = () => {
    switch (activeView) {
      case 'journal':
        return <JournalEntry onBack={() => setActiveView('home')} />;
      case 'chat':
        return <ChatBot onBack={() => setActiveView('home')} />;
      case 'dashboard':
        return <Dashboard onBack={() => setActiveView('home')} />;
      case 'tips':
        return <Tips onBack={() => setActiveView('home')} />;
      case 'profile':
        return <Profile onBack={() => setActiveView('home')} />;
      default:
        return (
          <div className="home-view">
            <div className="home-header">
              <div className="welcome-section">
                <h1 className="home-title">Welcome to MindSpace</h1>
                <p className="home-subtitle">Your personal mental wellness companion</p>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                <LogOut size={20} />
                Logout
              </button>
            </div>

            <div className="features-grid">
              <div className="feature-card" onClick={() => setActiveView('journal')}>
                <div className="feature-icon journal">
                  <BookOpen size={32} />
                </div>
                <h3>Daily Journal</h3>
                <p>Write about your thoughts, feelings, and track your daily mood</p>
                <div className="feature-arrow">→</div>
              </div>

              <div className="feature-card" onClick={() => setActiveView('chat')}>
                <div className="feature-icon chat">
                  <MessageCircle size={32} />
                </div>
                <h3>AI Companion</h3>
                <p>Chat with your supportive AI companion for guidance and comfort</p>
                <div className="feature-arrow">→</div>
              </div>

              <div className="feature-card" onClick={() => setActiveView('dashboard')}>
                <div className="feature-icon dashboard">
                  <BarChart3 size={32} />
                </div>
                <h3>Analytics</h3>
                <p>Visualize your mood trends and track your mental wellness journey</p>
                <div className="feature-arrow">→</div>
              </div>

              <div className="feature-card" onClick={() => setActiveView('tips')}>
                <div className="feature-icon tips">
                  <Lightbulb size={32} />
                </div>
                <h3>Wellness Tips</h3>
                <p>Discover daily affirmations and mental health tips for better wellbeing</p>
                <div className="feature-arrow">→</div>
              </div>

              <div className="feature-card" onClick={() => setActiveView('profile')}>
                <div className="feature-icon profile">
                  <User size={32} />
                </div>
                <h3>Profile & Settings</h3>
                <p>Manage your profile, preferences, and data settings</p>
                <div className="feature-arrow">→</div>
              </div>
            </div>

            <div className="quick-stats">
              <h3>Your Progress</h3>
              <div className="stats-row">
                <div className="quick-stat">
                  <div className="stat-value">
                    {JSON.parse(localStorage.getItem('journalEntries') || '[]').length}
                  </div>
                  <div className="stat-label">Journal Entries</div>
                </div>
                <div className="quick-stat">
                  <div className="stat-value">
                    {JSON.parse(localStorage.getItem('chatMessages') || '[]').filter(m => m.sender === 'user').length}
                  </div>
                  <div className="stat-label">Chat Messages</div>
                </div>
                <div className="quick-stat">
                  <div className="stat-value">
                    {JSON.parse(localStorage.getItem('favoriteTips') || '[]').length}
                  </div>
                  <div className="stat-label">Favorite Tips</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="main-app">
      {renderActiveView()}
    </div>
  );
};

export default MainApp;