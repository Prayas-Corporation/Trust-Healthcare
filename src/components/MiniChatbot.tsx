// components/MiniChatbot.tsx
'use client';
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GoogleGenerativeAI } from '@google-ai/generative';

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);


const MiniChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: 'Hi! How can I help you today?', sender: 'bot' }]);
  const [userMessage, setUserMessage] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };
  const sendMessage = async () => {
    if (userMessage.trim() === '') return;
  
    const newMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setUserMessage('');
  
    // Initialize the GoogleGenerativeAI client
    const genAI = new GoogleGenerativeAI('AIzaSyDcBsz-OK0rZ5cSY5EkoMIodpax63m_FWs'); // Use env variable for API key
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
    try {
      // Generate content based on the user's message
      const prompt = `
        only respond if its greeting or the questions are about medical stuff
        If the question is not about that, respond with: "I can only answer questions related to Trust Healthcare."
      Here’s the question: '${userMessage}'
    
    `;

      const result = await model.generateContent(prompt);
      
      // Access the generated content, assuming response structure
      const botResponse = result.response.text(); // Adjust based on API's actual response
      
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error("Error generating content:", error);
      setMessages([...newMessages, { text: 'Oops, something went wrong!', sender: 'bot' }]);
    }
  };
  

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button 
        onClick={toggleChatbot}
        style={{
          backgroundColor: '#6200ea',
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        💬
      </button>

      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            width: '300px',
            height: '400px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '8px' }}>
            {messages.map((message, index) => (
              <div 
                key={index}
                style={{
                  marginBottom: '10px',
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.sender === 'user' ? '#e1ffc7' : '#f1f1f1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  maxWidth: '80%',
                  wordWrap: 'break-word'
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: '8px' }}>
            <input 
              type="text" 
              value={userMessage} 
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              onClick={sendMessage}
              style={{
                backgroundColor: '#6200ea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginLeft: '8px',
                padding: '8px 12px',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniChatbot;
