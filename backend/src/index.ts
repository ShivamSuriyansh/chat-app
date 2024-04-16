import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'
const cors = require('cors')

const app = express();
app.use(cors())
const httpServer = app.listen(8080);
const wss = new WebSocketServer({server: httpServer});
const rooms = new Map();

import router from './routes/routes'


app.use(express.json());
app.use('/api', router)


class SocketWithClientId {
    socket: WebSocket;
    clientId: string;
  
    constructor(socket: WebSocket) {
      this.socket = socket;
      this.clientId = generateUniqueID();
    }
  }

function generateUniqueID(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
}

wss.on('connection',(socket)=>{
    socket.on('error', (err)=>console.error(err));
    //create a new key on socket( unique identifier ) so that on client side we can identify which user send what 
    const socketWithClientId = new SocketWithClientId(socket);

    socketWithClientId.socket.on('message',(data , isBinary)=>{
        const message = {
            clientId : socketWithClientId.clientId,
            data 
        }
        wss.clients.forEach((client , req)=>{
            if(client.readyState == WebSocket.OPEN){
                // console.log('Client: ',client);
                client.send(JSON.stringify(message), {binary: isBinary})
                // console.log(data.toString());
            }
        })
    })

    socket.send('Connection Established!!');
})