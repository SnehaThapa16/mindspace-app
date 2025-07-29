import React from 'react';
import { useState } from 'react';
import { Heart, Brain, Sparkles, BookOpen, MessageCircle, BarChart3, Shield, Users, Clock, CheckCircle, X } from 'lucide-react';
import AuthModal from './AuthModal';
import './Welcome.css';

const Welcome = ({ onAuthSuccess }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleLearnMore = () => {
    setShowLearnMore(true);
  };

  const handleAuthSuccess = (userType) => {
    setShowAuthModal(false);
    onAuthSuccess(userType);
  };

  return (
    <>
      <div className="welcome-container">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="welcome-icon">
              <Brain size={48} />
            </div>
          </div>
          
          <h1 className="welcome-title">
            Welcome to MindSpace
          </h1>
          
          <p className="welcome-description">
            Your personal sanctuary for mental wellness. Track your emotions, journal your thoughts, 
            and connect with our AI companion in a safe, private space designed just for you.
          </p>
          
          <div className="welcome-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              Begin Your Journey
            </button>
            
            <button className="btn-secondary" onClick={handleLearnMore}>
              Discover Features
            </button>
          </div>
          
          <div className="welcome-features">
            <div className="feature-item">
              <Shield size={16} />
              <span>Private & Secure</span>
            </div>
            <div className="feature-item">
              <Heart size={16} />
              <span>AI Companion</span>
            </div>
            <div className="feature-item">
              <Sparkles size={16} />
              <span>Mood Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="learn-more-modal">
          <div className="learn-more-content">
            <button className="learn-more-close" onClick={() => setShowLearnMore(false)}>
              <X size={20} />
            </button>
            
            <div className="learn-more-header">
              <h2 className="learn-more-title">Transform Your Mental Wellness Journey</h2>
              <p className="learn-more-subtitle">
                MindSpace combines cutting-edge AI technology with proven mental health practices 
                to create your personal sanctuary for emotional well-being.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-card-icon">
                  <BookOpen size={24} />
                </div>
                <h3>Smart Journaling</h3>
                <p>Express your thoughts with our intelligent journaling system that tracks your mood patterns and provides personalized insights.</p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <MessageCircle size={24} />
                </div>
                <h3>AI Companion</h3>
                <p>Chat with your supportive AI companion that understands your emotions and provides gentle guidance when you need it most.</p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <BarChart3 size={24} />
                </div>
                <h3>Mood Analytics</h3>
                <p>Visualize your emotional journey with beautiful charts and insights that help you understand your mental health patterns.</p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <Sparkles size={24} />
                </div>
                <h3>Daily Inspiration</h3>
                <p>Receive personalized affirmations and mental health tips tailored to your current emotional state and needs.</p>
              </div>
            </div>

            <div className="benefits-section">
              <h3>Why Choose MindSpace?</h3>
              <div className="benefits-list">
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>100% Private & Secure</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Works Offline</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>No Subscription Required</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Evidence-Based Techniques</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Personalized Experience</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>24/7 AI Support</span>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h3>Ready to Start Your Journey?</h3>
              <p>Join thousands of users who have transformed their mental wellness with MindSpace. Your journey to better mental health starts with a single step.</p>
              <button className="cta-button" onClick={() => {
                setShowLearnMore(false);
                handleGetStarted();
              }}>
                Start Your Free Journey
              </button>
            </div>
          </div>
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Welcome;