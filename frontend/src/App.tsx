import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:8000/api/send_message', {
        chat_id: chatId,
        text: message
      });
      alert('Сообщение отправлено!');
      setMessage('');
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages');
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Notizen bot interface</h1>
      
      <div>
        <input
          type="text"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="Chat ID"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ваше сообщение"
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>

      <h2>История сообщений</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>User {msg.user}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;