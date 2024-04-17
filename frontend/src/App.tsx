import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Chat from './pages/Chat'
import Login from './pages/Login';

const useSocket = ()=>{
  const [socket , setSocket] = useState<null | WebSocket>(null);
  useEffect(()=>{
    const newSocket = new WebSocket('ws:localhost:8080/');
    newSocket.onopen = ()=>{
      console.log("Connection Established!");
      setSocket(newSocket);
    }
    return ()=>{
      socket?.close();
    }
  },[])
  return socket;
}

function App() {
  const [value , setValue ] = useState<string>('');
  const [message , setMessage] = useState<string[] | undefined>([])
  const [authenticatedUser , setAuthenticatedUser] = useState<string>('');
  const socket  = useSocket();
  const send = (value : string)=>{
    if(!value)return;
    socket?.send(value)
  }

  useEffect(()=>{
    socket? socket.onmessage = (message)=>{
      console.log(message.data);
      setMessage((prev :any)=> [...prev , message.data]);
    } : console.log('nothing');
  },[socket])

  if(!socket){
    return <div>
      Waiting for connection...
    </div>
  }

  return <div className=' w-full p-3 m-auto flex justify-center h-screen bg-green-100 items-center' >
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login setAuthenticatedUser={setAuthenticatedUser} />}  />
        <Route path='/chat' element ={<Chat  text={message} send={send} value={value} setValue={setValue} authenticatedUser={authenticatedUser} />} />
      </Routes>
    </BrowserRouter>
    
  </div>
}

export default App
