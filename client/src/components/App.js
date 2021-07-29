import '../styles/App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Join from './Join';
import { useState } from 'react';
import Room from './Room';

function App() {
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [joined, setJoined] = useState(false);
  return (
    <Router>
      <Switch>
        <Route path='/:id'>
          <Room user={user} setUser={setUser} setJoined={setJoined} />
        </Route>
        <Route path='/'>
          {joined ? <Redirect to={`/${room}`} /> : <Join setUser={setUser} setRoom={setRoom} setJoined={setJoined} />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
