import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Room.css';

export default function Room({ user, setUser, setJoined }) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const wsUrl = window.location.href.replace('http', 'ws');

    if (user) {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = e => {
        wsRef.current.send(user);
      };

      wsRef.current.onmessage = msg => {
        setMessages(prev => [...prev, msg]);
      };

      wsRef.current.onclose = e => {

      };

      wsRef.current.onerror = e => {

      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user])

  const handleSubmit = e => {
    e.preventDefault();
    setUser(e.target[0].value);
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

      }
    </div>
  );
}