import React, { useState, useEffect } from 'react';
import { Heart, Star, RefreshCw, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import './Tips.css';

const Tips = ({ onBack }) => {
  const [currentTip, setCurrentTip] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tips = {
    anxiety: [
      {
        id: 1,
        title: "4-7-8 Breathing",
        content: "Breathe in for 4 counts, hold for 7, exhale for 8. This activates your body's relaxation response.",
        category: "anxiety",
        type: "technique"
      },
      {
        id: 2,
        title: "Ground Yourself",
        content: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
        category: "anxiety",
        type: "technique"
      },
      {
        id: 3,
        title: "Anxiety is Temporary",
        content: "This feeling will pass. You have survived difficult moments before, and you will get through this one too.",
        category: "anxiety",
        type: "affirmation"
      }
    ],
    depression: [
      {
        id: 4,
        title: "Small Steps Count",
        content: "You don't have to climb the whole mountain today. Just take the next step, however small it may be.",
        category: "depression",
        type: "affirmation"
      },
      {
        id: 5,
        title: "Sunlight Therapy",
        content: "Spend 10-15 minutes in natural sunlight each day. It helps regulate your circadian rhythm and mood.",
        category: "depression",
        type: "technique"
      },
      {
        id: 6,
        title: "You Matter",
        content: "Your presence in this world makes a difference. You are valued, loved, and worthy of happiness.",
        category: "depression",
        type: "affirmation"
      }
    ],
    stress: [
      {
        id: 7,
        title: "Progressive Muscle Relaxation",
        content: "Tense and then relax each muscle group in your body, starting from your toes and working up to your head.",
        category: "stress",
        type: "technique"
      },
      {
        id: 8,
        title: "One Thing at a Time",
        content: "You don't have to do everything at once. Focus on one task, complete it, then move to the next.",
        category: "stress",
        type: "affirmation"
      },
      {
        id: 9,
        title: "Take Breaks",
        content: "Schedule regular 5-10 minute breaks throughout your day. Step away, breathe, and reset your mind.",
        category: "stress",
        type: "technique"
      }
    ],
    general: [
      {
        id: 10,
        title: "Practice Gratitude",
        content: "Write down three things you're grateful for each day. This simple practice can shift your perspective.",
        category: "general",
        type: "technique"
      },
      {
        id: 11,
        title: "You Are Enough",
        content: "You don't need to be perfect. You are enough exactly as you are, right now, in this moment.",
        category: "general",
        type: "affirmation"
      },
      {
        id: 12,
        title: "Mindful Moments",
        content: "Take a moment to notice your breath, the feeling of your feet on the ground, the sounds around you.",
        category: "general",
        type: "technique"
      }
    ]
  };

  const categories = [
    { id: 'all', label: 'All Tips', icon: BookOpen },
    { id: 'anxiety', label: 'Anxiety', icon: Heart },
    { id: 'depression', label: 'Depression', icon: Sparkles },
    { id: 'stress', label: 'Stress', icon: RefreshCw },
    { id: 'general', label: 'General', icon: Lightbulb }
  ];

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteTips') || '[]');
    setFavorites(savedFavorites);
    
    // Show daily tip on load
    showDailyTip();
  }, []);

  const getAllTips = () => {
    return Object.values(tips).flat();
  };

  const getFilteredTips = () => {
    if (selectedCategory === 'all') {
      return getAllTips();
    }
    return tips[selectedCategory] || [];
  };

  const showDailyTip = () => {
    const allTips = getAllTips();
    const today = new Date().toDateString();
    const savedDailyTip = localStorage.getItem('dailyTip');
    const savedDate = localStorage.getItem('dailyTipDate');
    
    if (savedDate === today && savedDailyTip) {
      setCurrentTip(JSON.parse(savedDailyTip));
    } else {
      const randomTip = allTips[Math.floor(Math.random() * allTips.length)];
      setCurrentTip(randomTip);
      localStorage.setItem('dailyTip', JSON.stringify(randomTip));
      localStorage.setItem('dailyTipDate', today);
    }
  };

  const getRandomTip = () => {
    const filteredTips = getFilteredTips();
    const randomTip = filteredTips[Math.floor(Math.random() * filteredTips.length)];
    setCurrentTip(randomTip);
  };

  const toggleFavorite = (tip) => {
    const isFavorite = favorites.some(fav => fav.id === tip.id);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== tip.id);
    } else {
      updatedFavorites = [...favorites, tip];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteTips', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (tip) => {
    return favorites.some(fav => fav.id === tip.id);
  };

  return (
    <div className="tips-container">
      <div className="tips-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="tips-title">Mental Health Tips</h1>
      </div>

      <div className="tips-content">
        {/* Daily Tip Card */}
        <div className="daily-tip-card">
          <div className="daily-tip-header">
            <h2>
              <Sparkles size={24} />
              Daily Inspiration
            </h2>
            <button className="refresh-btn" onClick={showDailyTip}>
              <RefreshCw size={20} />
            </button>
          </div>
          
          {currentTip && (
            <div className="tip-content">
              <div className="tip-header">
                <h3 className="tip-title">{currentTip.title}</h3>
                <button 
                  className={`favorite-btn ${isFavorite(currentTip) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(currentTip)}
                >
                  <Star size={20} />
                </button>
              </div>
              <p className="tip-text">{currentTip.content}</p>
              <div className="tip-meta">
                <span className={`tip-category ${currentTip.category}`}>
                  {currentTip.category}
                </span>
                <span className={`tip-type ${currentTip.type}`}>
                  {currentTip.type}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="categories-section">
          <h3>Browse by Category</h3>
          <div className="categories-grid">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon size={20} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips Grid */}
        <div className="tips-section">
          <div className="tips-section-header">
            <h3>
              {selectedCategory === 'all' ? 'All Tips' : 
               categories.find(c => c.id === selectedCategory)?.label}
            </h3>
            <button className="random-tip-btn" onClick={getRandomTip}>
              <RefreshCw size={16} />
              Random Tip
            </button>
          </div>
          
          <div className="tips-grid">
            {getFilteredTips().map((tip) => (
              <div key={tip.id} className="tip-card">
                <div className="tip-header">
                  <h4 className="tip-title">{tip.title}</h4>
                  <button 
                    className={`favorite-btn ${isFavorite(tip) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(tip)}
                  >
                    <Star size={16} />
                  </button>
                </div>
                <p className="tip-text">{tip.content}</p>
                <div className="tip-meta">
                  <span className={`tip-category ${tip.category}`}>
                    {tip.category}
                  </span>
                  <span className={`tip-type ${tip.type}`}>
                    {tip.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="favorites-section">
            <h3>
              <Star size={20} />
              Your Favorites ({favorites.length})
            </h3>
            <div className="tips-grid">
              {favorites.map((tip) => (
                <div key={tip.id} className="tip-card favorite">
                  <div className="tip-header">
                    <h4 className="tip-title">{tip.title}</h4>
                    <button 
                      className="favorite-btn favorited"
                      onClick={() => toggleFavorite(tip)}
                    >
                      <Star size={16} />
                    </button>
                  </div>
                  <p className="tip-text">{tip.content}</p>
                  <div className="tip-meta">
                    <span className={`tip-category ${tip.category}`}>
                      {tip.category}
                    </span>
                    <span className={`tip-type ${tip.type}`}>
                      {tip.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tips;