import React, { useState, useEffect } from 'react';
import { Brain, Heart, Sparkles, Zap } from 'lucide-react';
import './LogoIntro.css';

const LogoIntro = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.22; // 45 steps over 4.5 seconds
      });
    }, 100);

    const completionTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onComplete();
      }, 800); // Extra time for fade out animation
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <div className={`logo-intro ${!isLoading ? 'fade-out' : ''}`}>
      <div className="background-gradient"></div>
      
      {/* Floating Sparkles */}
      <div className="sparkles-container">
        <div className="sparkle sparkle-1">
          <Sparkles size={20} />
        </div>
        <div className="sparkle sparkle-2">
          <Heart size={16} />
        </div>
        <div className="sparkle sparkle-3">
          <Zap size={18} />
        </div>
        <div className="sparkle sparkle-4">
          <Brain size={22} />
        </div>
        <div className="sparkle sparkle-5">
          <Sparkles size={14} />
        </div>
        <div className="sparkle sparkle-6">
          <Heart size={20} />
        </div>
      </div>

      <div className="logo-container">
        <div className="logo-content">
          <div className="logo-icon">
            <Brain size={64} />
          </div>
          <h1 className="logo-text">MindSpace</h1>
          <p className="logo-subtitle">Your Mental Wellness Journey</p>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="loading-text">Creating your safe space...</p>
      </div>
    </div>
  );
};

export default LogoIntro;