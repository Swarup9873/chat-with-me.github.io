import {useState , useEffect } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from "pusher-js";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import { useStateValue } from './StateProvider';


function App() {

  // const [user,setUser] =useState(null);
  const [{user},dispatch] = useStateValue();
  const [messages,setMessages] = useState([]);

  
  function MainLayout() {
    return (
      <>
        <Sidebar />
        <Routes>
          <Route path="/rooms/:roomId" element={<Chat messages={messages}/>} />
          <Route path="/" element={<Chat messages={messages} />} />
        </Routes>
      </>
    );
  }

  useEffect(()=>{
    const pusher = new Pusher('39a8e746fbacea479fd1', {
      cluster: 'eu'
    });

    const  channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage)=> {
      setMessages([...messages,newMessage]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages]);


  return (
    <div className="app">

        {!user ? (
          <Login />
        ) : (
          <div className='app__body'>

        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/rooms/:roomId" element={<MainLayout />} />
          </Routes>
        </Router>
        
        
        </div>

        )}

    </div>
  );
}

export default App;


