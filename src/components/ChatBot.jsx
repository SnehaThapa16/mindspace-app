import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Heart, Sparkles } from 'lucide-react';
import './ChatBot.css';

const ChatBot = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    if (savedMessages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm your AI companion here to provide support and listen to you. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
    } else {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Free AI using Hugging Face Inference API
  const getAIResponse = async (message) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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", // Replace with your real key
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173", // Required, set to your domain if deployed
        "X-Title": "AI Companion Chatbot"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a supportive mental health companion. Reply with empathy." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    console.log("AI Response:", result);
    return result.choices?.[0]?.message?.content || getFallbackResponse(message);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return getFallbackResponse(message);
  }
};


  // Fallback responses for when AI API is unavailable
  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Mood-based responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      const anxietyResponses = [
        "I understand you're feeling anxious. Try taking slow, deep breaths. Breathe in for 4 counts, hold for 4, then exhale for 6. You're safe right now.",
        "Anxiety can feel overwhelming, but remember it's temporary. Can you name 5 things you can see around you right now? This grounding technique can help.",
        "I hear that you're anxious. That's a valid feeling. What's one small thing that usually brings you comfort?"
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      const sadnessResponses = [
        "I'm sorry you're feeling sad. Your feelings are valid and it's okay to not be okay sometimes. What's one small thing that brought you joy recently?",
        "Sadness is a natural human emotion. You don't have to carry this alone. Is there something specific that's weighing on your heart?",
        "I can sense you're going through a difficult time. Remember that this feeling won't last forever. You've overcome challenges before."
      ];
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)];
    }
    
    if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
      const stressResponses = [
        "Feeling stressed is your mind's way of saying you care deeply. Let's break things down - what's the most pressing thing on your mind right now?",
        "When we're overwhelmed, everything feels urgent. But you don't have to solve everything today. What's one small step you could take?",
        "Stress can feel like carrying the world on your shoulders. Remember to breathe and take things one moment at a time."
      ];
      return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      const happyResponses = [
        "I'm so glad to hear you're feeling good! What's bringing you joy today? It's wonderful to celebrate these positive moments.",
        "That's fantastic! Your positive energy is contagious. What's been the highlight of your day?",
        "I love hearing when you're doing well! These good moments are important to acknowledge and cherish."
      ];
      return happyResponses[Math.floor(Math.random() * happyResponses.length)];
    }
    
    // General supportive responses
    const generalResponses = [
      "Thank you for sharing that with me. I'm here to listen and support you. How are you feeling right now?",
      "I appreciate you opening up. Your thoughts and feelings matter. What would be most helpful for you in this moment?",
      "I'm here for you. Sometimes just talking about what's on our mind can help. Tell me more about what you're experiencing.",
      "You're being very brave by reaching out. I'm listening with care. What's been on your heart lately?",
      "I want you to know that you're not alone. I'm here to support you through whatever you're facing. How can I help?"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Try AI response first, fallback to supportive responses
      const aiResponse = await getAIResponse(inputMessage);
      
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
      localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now, but I'm still here to listen. Can you try again?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, errorResponse];
      setMessages(finalMessages);
      localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear all messages?')) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm your AI companion here to provide support and listen to you. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="chatbot-title">
          <Bot className="bot-icon" size={24} />
          <h1>AI Companion</h1>
        </div>
        <button className="clear-btn" onClick={clearChat}>Clear</button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-avatar">
              {message.sender === 'bot' ? (
                <Bot size={20} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot typing">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="quick-actions">
          <button 
            className="quick-btn"
            onClick={() => setInputMessage("I'm feeling anxious today")}
          >
            😰 Anxious
          </button>
          <button 
            className="quick-btn"
            onClick={() => setInputMessage("I need some motivation")}
          >
            ✨ Motivation
          </button>
          <button 
            className="quick-btn"
            onClick={() => setInputMessage("I'm having a good day")}
          >
            😊 Good Day
          </button>
        </div>
        
        <div className="chat-input">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts and feelings..."
            className="message-input"
            rows={1}
          />
          <button 
            className="send-btn"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;