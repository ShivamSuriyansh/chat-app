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

wss.on('connection',(socket)=>{
    socket.on('error', (err)=>console.error(err));
    //const ip = req.socket.remoteAddress;// will remain the samne for each 
    socket.on('message',(data , isBinary)=>{
        wss.clients.forEach((client , req)=>{
            if(client.readyState == WebSocket.OPEN){
                console.log('Client: ',client);
                client.send(data, {binary: isBinary})
                console.log(data.toString());
            }
        })
    })

    socket.send('Connection Established!!');
})