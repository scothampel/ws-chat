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
    // Replace for dev, shouldn't have any effect in prod
    const wsUrl = window.location.href.replace('http', 'ws').replace(':3000', ':3001');

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
        // Message card element
        const messageCard = document.querySelector('.messages .card-body');
        // TODO: Maybe make switch
        // Check for new message, append to old messages
        if (data.type === 'message') {
          // Check if messages card is scrolled to the bottom
          const shouldScroll = messageCard.scrollTop === messageCard.scrollHeight - messageCard.clientHeight ? true : false;

          setMessages(prev => [...prev, data]);

          //only change scroll pos if user hasn't scrolled to another pos
          if (shouldScroll) messageCard.scrollTo({ top: messageCard.scrollHeight });
        }
        // Room exists already
        else if (!data.type) {
          setMessages(data);
          // Scroll to most recent messages
          messageCard.scrollTo({ top: messageCard.scrollHeight });
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
  const handleSubmitUser = e => {
    e.preventDefault();
    setUser(e.target[0].value);
  }

  // Send message
  const handleSubmitMsg = e => {
    e.preventDefault()
    wsRef.current.send(e.target[0].value);
    // Scroll to bottom
    document.querySelector('.messages .card-body').scrollTo({ top: document.querySelector('.messages .card-body').scrollHeight });
  }

  return (
    <div className='container py-3 room'>
      {
        !user &&
        <form onSubmit={handleSubmitUser} className='col-md-6 offset-md-3'>
          <div className="form-group mb-3">
            <label htmlFor='user' >Username</label>
            <input type='text' className='form-control' id='user' required />
          </div>
          <button type='submit' className='btn btn-success' >Join</button>
        </form>
      }
      {
        user &&
        <div className='col-md-6 offset-md-3'>
          <div className='card messages mb-3'>
            <div className="card-header">
              <b>Room:</b> {id}
            </div>
            <div className="card-body">
              {messages.map((val, index) => {
                if (val.user === user) {
                  return <p key={index} className='text-end'><i>{val.message}</i></p>
                }

                return (
                  <p key={index}>
                    <b>{val.user}: </b>
                    {val.message}
                  </p>
                );
              })}
            </div>
          </div>
          <form onSubmit={handleSubmitMsg}>
            <div className='input-group'>
              <input type='text' className='form-control' id='msg' required />
              <button type='submit' className='btn btn-success' >Send</button>
            </div>
          </form>
        </div>
      }
    </div>
  );
}