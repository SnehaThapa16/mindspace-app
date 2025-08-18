import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User } from 'lucide-react';
import './ChatBot.css';

const ChatBot = ({ onBack, userType }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const storageKey = `chatMessages_${userType}`;

  const getUserType = () => {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    return session.type || 'guest';
  };

  useEffect(() => {
    const userType = getUserType();
    const savedMessages = JSON.parse(localStorage.getItem(`chatMessages_${userType}`) || '[]');
    if (savedMessages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm your AI companion here to provide support and listen to you. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(`chatMessages_${userType}`, JSON.stringify([welcomeMessage]));
    } else {
      setMessages(savedMessages);
    }
  }, [storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call Netlify function to get AI response
  const getAIResponse = async (message) => {
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history: conversationHistory }),
      });

      const data = await res.json();
      return data.reply || null;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      const anxietyResponses = [
        "I understand you're feeling anxious. Try taking slow, deep breaths. You're safe right now.",
        "Anxiety can feel overwhelming, but remember it's temporary. Can you name 5 things you can see around you right now?",
        "I hear that you're anxious. What's one small thing that usually brings you comfort?"
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      const sadnessResponses = [
        "I'm sorry you're feeling sad. What's one small thing that brought you joy recently?",
        "Sadness is a natural human emotion. Is there something specific that's weighing on your heart?",
        "This feeling won't last forever. You've overcome challenges before."
      ];
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)];
    }

    if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
      const stressResponses = [
        "Let's break things down - what's the most pressing thing on your mind right now?",
        "What's one small step you could take to reduce stress?",
        "Stress can feel like carrying the world on your shoulders. Take a moment to breathe."
      ];
      return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }

    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      const happyResponses = [
        "I'm so glad to hear you're feeling good! What's bringing you joy today?",
        "Fantastic! What's been the highlight of your day?",
        "Love hearing that! These good moments are precious."
      ];
      return happyResponses[Math.floor(Math.random() * happyResponses.length)];
    }

    const generalResponses = [
      "Thank you for sharing that with me. How are you feeling right now?",
      "I'm here to listen. What would be most helpful for you in this moment?",
      "You're being very brave by opening up. I'm here for you.",
      "I want you to know that you're not alone. I'm here to support you."
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
      let aiResponse = await getAIResponse(inputMessage);
      if (!aiResponse) aiResponse = getFallbackResponse(inputMessage);

      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
      const userType = getUserType();
      localStorage.setItem(`chatMessages_${userType}`, JSON.stringify(finalMessages));
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
      const userType = getUserType();
      localStorage.setItem(`chatMessages_${userType}`, JSON.stringify(finalMessages));
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
      const userType = getUserType();
      localStorage.setItem(`chatMessages_${userType}`, JSON.stringify([welcomeMessage]));
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
              {message.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div className="message-text">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="quick-actions">
          <button className="quick-btn" onClick={() => setInputMessage("I'm feeling anxious today")}>😰 Anxious</button>
          <button className="quick-btn" onClick={() => setInputMessage("I need some motivation")}>✨ Motivation</button>
          <button className="quick-btn" onClick={() => setInputMessage("I'm having a good day")}>😊 Good Day</button>
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
