import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({server: httpServer});


wss.on('connection',(socket)=>{
    socket.on('error', (err)=>console.error(err));

    socket.on('message',(data , isBinary)=>{
        wss.clients.forEach((client)=>{
            if(client.readyState == WebSocket.OPEN){
                client.send(data, {binary: isBinary})
                console.log(data.toString());
            }
        })
    })

    socket.send('Connection Established!!');
})