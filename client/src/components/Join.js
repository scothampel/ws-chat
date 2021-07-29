import '../styles/Join.css';

export default function Join({ setUser, setJoined, setRoom }) {
  const handleSubmit = e => {
    e.preventDefault();

    const room = e.target[0].value;
    const user = e.target[1].value;

    setUser(user);
    setRoom(room);
    setJoined(true);
  }

  return (
    <div className='container py-3'>
      <form onSubmit={handleSubmit} className='col-md-6 offset-md-3'>
        <div className="form-group mb-3">
          <label htmlFor='room' >Room Id</label>
          <input type='text' className='form-control' id='room' required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor='user' >Username</label>
          <input type='text' className='form-control' id='user' required />
        </div>
        <button type='submit' className='btn btn-success' >Join</button>
      </form>
    </div>
  );
}