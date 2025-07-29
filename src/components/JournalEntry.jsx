import React, { useState, useEffect } from 'react';
import { Calendar, Save, Heart, Smile, Meh, Frown, Sun, Cloud, CloudRain } from 'lucide-react';
import './JournalEntry.css';

const JournalEntry = ({ onBack, userType }) => {
  const [entry, setEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const storageKey = `journalEntries_${userType}`;

  const moods = [
    { id: 'excellent', emoji: '😄', label: 'Excellent', color: '#10b981', icon: Sun },
    { id: 'good', emoji: '😊', label: 'Good', color: '#3b82f6', icon: Smile },
    { id: 'okay', emoji: '😐', label: 'Okay', color: '#f59e0b', icon: Meh },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#ef4444', icon: Cloud },
    { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#8b5cf6', icon: CloudRain }
  ];

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setEntries(savedEntries);
  }, [storageKey]);

  const saveEntry = () => {
    if (!entry.trim() || !selectedMood) {
      alert('Please write something and select your mood!');
      return;
    }

    const newEntry = {
      id: isEditing ? editingId : Date.now(),
      date: selectedDate,
      content: entry,
      mood: selectedMood,
      timestamp: new Date().toISOString()
    };

    let updatedEntries;
    if (isEditing) {
      updatedEntries = entries.map(e => e.id === editingId ? newEntry : e);
    } else {
      updatedEntries = [newEntry, ...entries];
    }

    setEntries(updatedEntries);
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    
    // Reset form
    setEntry('');
    setSelectedMood(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setIsEditing(false);
    setEditingId(null);
  };

  const editEntry = (entryToEdit) => {
    setEntry(entryToEdit.content);
    setSelectedMood(entryToEdit.mood);
    setSelectedDate(entryToEdit.date);
    setIsEditing(true);
    setEditingId(entryToEdit.id);
  };

  const deleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(e => e.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    }
  };

  return (
    <div className="journal-container">
      <div className="journal-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="journal-title">Daily Journal</h1>
      </div>

      <div className="journal-content">
        <div className="journal-form">
          <div className="date-selector">
            <Calendar className="date-icon" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="mood-selector">
            <h3>How are you feeling today?</h3>
            <div className="mood-options">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  className={`mood-btn ${selectedMood === mood.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(mood.id)}
                  style={{ '--mood-color': mood.color }}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="entry-area">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write about your day, thoughts, feelings, or anything on your mind..."
              className="journal-textarea"
              rows={8}
            />
          </div>

          <button className="save-btn" onClick={saveEntry}>
            <Save size={20} />
            {isEditing ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>

        <div className="entries-list">
          <h3>Previous Entries</h3>
          {entries.length === 0 ? (
            <div className="no-entries">
              <Heart size={48} className="no-entries-icon" />
              <p>No entries yet. Start writing your first journal entry!</p>
            </div>
          ) : (
            entries.map((entryItem) => {
              const mood = moods.find(m => m.id === entryItem.mood);
              return (
                <div key={entryItem.id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-date">
                      <Calendar size={16} />
                      {new Date(entryItem.date).toLocaleDateString()}
                    </div>
                    <div className="entry-mood" style={{ color: mood?.color }}>
                      {mood?.emoji} {mood?.label}
                    </div>
                  </div>
                  <div className="entry-content">
                    {entryItem.content}
                  </div>
                  <div className="entry-actions">
                    <button onClick={() => editEntry(entryItem)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => deleteEntry(entryItem.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;