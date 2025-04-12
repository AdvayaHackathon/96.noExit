import React, { useState } from 'react';
import axios from 'axios'; // Used for making API calls

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Display user message
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      // Call AI chatbot API (replace `CHATBOT_API_URL` with the actual endpoint)
      const response = await axios.post(
        'CHATBOT_API_URL', // Replace with your chatbot API URL
        {
          prompt: input, // The user input
          max_tokens: 150, // Customize token limit based on API
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer YOUR_API_KEY`, // Replace with your API key
          },
        }
      );

      // Display bot response
      const botMessage = { sender: 'bot', text: response.data.choices[0].text };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      const errorMessage = { sender: 'bot', text: 'Oops! Something went wrong.' };
      setMessages([...messages, userMessage, errorMessage]);
    }

    setInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'bot' ? 'bot' : 'user'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
