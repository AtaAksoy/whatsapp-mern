import { useEffect, useState } from 'react';
import './App.css';
import Chat from './Components/Chat/Chat';
import Sidebar from './Components/Sidebar/Sidebar';
import axios from './axios'
import Pusher from 'pusher-js';
function App() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios.get('/messages/sync')
    .then(response => {
      setMessages(response.data)
    })
  }, [])

  useEffect(() => {
    const pusher = new Pusher('c2b2a01b0447162b025c', {
      cluster: 'eu'
    });
  
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages])

  console.log(messages)
  
  return (
    <div className="App">
      <div className="app__body">
      {/* SIDEBAR */}
      <Sidebar></Sidebar>
      {/* Chat Component */}
      <Chat messages={messages}></Chat>
      </div>
    </div>
  );
}

export default App;
