import { useEffect, useState } from 'react'
import './App.css'
import Chat from './pages/Chat'

function App() {
  const [socket , setSocket] = useState<null | WebSocket>(null);
  const [message , setMessage] = useState<String[] | undefined>([])
  const [value , setValue ] = useState<string>('');

  useEffect(()=>{
    const newSocket = new WebSocket('ws://localhost:8080/');
    newSocket.onopen = ()=>{
      console.log("Connection Established!");
      setSocket(newSocket);
    }

    newSocket.onmessage = (message)=>{
      console.log(message.data);
      setMessage((prev :any)=> [...prev , message.data]);
    }
  },[])

  const send = (value : string)=>{
    socket?.send(value)
  }

  if(!socket){
    return <div>
      Waiting for connection...
    </div>
  }

  return <div className=' w-full p-3 m-auto flex' >
        <Chat text={message} setMessage={setMessage} value={value} setValue={setValue} send={send}  />
  </div>
}

export default App
