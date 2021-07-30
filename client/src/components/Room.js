import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Room.css';

export default function Room({ user, setUser, setJoined }) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    // Allow room changes
    setJoined(false)
    // Formatted webSocket url
    const wsUrl = window.location.href.replace('http', 'ws').replace('3000', '3001');

    // Check if username is set
    if (user) {
      // Open webSocket
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = e => {
        // Send username as first message
        wsRef.current.send(user);
      };

      wsRef.current.onmessage = msg => {
        // All messages are JSON encoded
        const data = JSON.parse(msg.data);
        // TODO: Maybe make switch
        // Check for new message, append to old messages
        if (data.type === 'message') {
          setMessages(prev => [...prev, data]);
        }
        // Room exists already
        else if (!data.type) {
          setMessages(data);
        }
        // TODO: Handle errors and info type
      };

      wsRef.current.onclose = e => {

      };

      wsRef.current.onerror = e => {

      };
    }

    // Cleanup
    return () => {
      // Check for established webSocket
      if (wsRef.current) {
        // Close webSocket 
        wsRef.current.close();
      }
    };
  }, [user, setJoined])

  // Set username
  const handleSubmit = e => {
    e.preventDefault();
    setUser(e.target[0].value);
  }

  // Temp ws send handler
  const handleClick = e => {
    e.preventDefault()
    wsRef.current.send(e.target[0].value)
  }

  return (
    <div className='container py-3'>
      {
        !user &&
        <form onSubmit={handleSubmit} className='col-md-6 offset-md-3'>
          <div className="form-group mb-3">
            <label htmlFor='user' >Username</label>
            <input type='text' className='form-control' id='user' required />
          </div>
          <button type='submit' className='btn btn-success' >Join</button>
        </form>
      }
      {
        user &&
        <form onSubmit={handleClick}>
          <input type='text' className='form-control' id='msg' required />
          <button type='submit' className='btn btn-success' >Send</button>
          {JSON.stringify(messages)}
        </form>
      }
    </div>
  );
}