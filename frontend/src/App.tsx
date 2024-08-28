import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Chat from './pages/Chat'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import { deplUrlHttp, deplUrlWs } from './config';
import { useRecoilValue } from 'recoil';
import { chatIdState } from './recoil/States';
// Vendors




export const useSocket = (token:string |null , code:string | undefined)=>{
  
  const chatIdRecoil = useRecoilValue(chatIdState)

  
  const [socket , setSocket] = useState<null | WebSocket>(null);
  // console.log('deplUrl: ',deplUrlHttp);
  
  const connectSocket = useCallback(async ()=>{
    if(!token) return;
    const response = await fetch(`${deplUrlHttp}/user/chat?token=${localStorage.getItem('token')}&room=${code || null}&directChatUserId=${chatIdRecoil || null}`);
    if (!response.ok) {
      throw new Error('HTTP GET request failed');
    }
    const newSocket = new WebSocket(`${deplUrlWs}/user/chat?token=${localStorage.getItem('token')}&room=${code || null}&directChatUserId=${chatIdRecoil || null}`);// modify the backend 
    newSocket.onopen = ()=> {
      console.log("Connection established!")
      setSocket(newSocket);
    }
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed, reconnecting...");
      setTimeout(connectSocket, 1000); // Try to reconnect every second
    };

    return newSocket;
  },[token])

  useEffect(() => {
    const initializeSocket = async () => {
      const socket = await connectSocket();
      return () => {
        socket?.close();
      };
    };

    initializeSocket();

  }, [connectSocket]);

  return socket;
}

function App() {
  const [value , setValue ] = useState<string>('');
  const [message , setMessage] = useState<any>([])
  const [authenticatedUser ,setAuthenticatedUser]  = useState<string>('');
  
  const [token , setToken] = useState<string | null>(null);
  const [code , setCode] = useState<string| undefined>('');
  const [roomCode , setRoomCode] = useState<string | undefined>('');

  const socket  = useSocket(token,roomCode);


  const send = (value : string)=>{
    if(!value)return;
    // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',value);
    socket?.send(value)

  }
  console.log(code);

  useEffect(()=>{
    socket? socket.onmessage = (event)=>{
      // console.log('((((((((((((((((: ',JSON.parse(event.data))
      setMessage((prev :any)=> [...prev , JSON.parse(event.data)]);//change the message 
    } : console.log('nothing');
  },[message,socket])


  return <div className=' w-full px-1  flex justify-center h-screen bg-white items-center' >

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing setCode={setCode} setRoomCode={setRoomCode}/>} />
        <Route path='/login' element={<Login setToken={setToken} setAuthenticatedUser={setAuthenticatedUser} />}  />
        <Route path='/signup' element={<Signup />}  />
        <Route path='/chat' element ={<Chat  text={message} setText={setMessage} send={send} value={value} setValue={setValue} authenticatedUser={authenticatedUser} />} />
      </Routes>
    </BrowserRouter>
    
  </div>
}

export default App