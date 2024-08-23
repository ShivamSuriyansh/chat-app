import express from 'express'
import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
const cors = require('cors')

const app = express();
app.use(cors())
export const httpServer = app.listen(8080);
export const wss = new WebSocketServer({ noServer: true });

const rooms = new Map();

import router from './routes/routes'
import { userAuth } from './middleware/auth';
import { JWT_SECRET } from './config';
import { parse } from 'dotenv';


app.use(express.json());
app.use('/api', router);
app.use('/user' ,userAuth,  router);

const wsMetadata = new Map();

httpServer.on('upgrade', (request , socket , head)=>{
    const url = request.url ?? '/';
    const pathname = new URL(url, `http://${request.headers.host}`).pathname;
    
    if(pathname=='/user/chat'){
        const params = new URLSearchParams(request.url?.split('?')[1]);
        const token = params.get('token');
        const roomCode = params.get('room');
        //making direct 1-1 chat
        const directChatUserId = params.get('directChatUserId');
        console.log(roomCode)
        if (!token) {
            socket.destroy();
            return;
        }
        //@ts-ignore
        const userId = request.userId;
        console.log('userID: ',userId);
        
        console.log('request token ', token);
        console.log('roomcode:  ', roomCode);

        try{
            if(!token){
                throw new Error("Token not provided");
            }

            const verified = jwt.verify(token , JWT_SECRET);
            wss.handleUpgrade(request, socket , head , (ws)=>{
                // ws.userId = verified.id;
                // //@ts-ignore
                // ws.roomCode = roomCode;

                const metadata = {
                    //@ts-ignore
                    userId: verified.id,
                    roomCode: roomCode || null,
                    directChatUserId: directChatUserId || null,
                };
                wsMetadata.set(ws,metadata);
                if(roomCode){
                    if (!rooms.has(roomCode)) {
                        rooms.set(roomCode, new Set());
                    }
                    rooms.get(roomCode).add(ws);
                }
                
                //@ts-ignore
                // wsMetadata.set(ws, { userId: verified.id, roomCode });
                // if (!rooms.has(roomCode)) {  
                //     rooms.set(roomCode, new Set());
                // }
                // rooms.get(roomCode).add(ws);
                wss.emit('connection' , ws , request);
            })
        }catch(e){
            console.error('Authentication error:', e);
            socket.destroy();
        }
        
    }else{
        console.log('does not work')
    }
})

wss.on('connection', (socket, request) => {
    console.log('New WebSocket connection');
  
    socket.on('error', (err) => console.error(err));
  
    socket.on('message', (data, isBinary) => {
        const metadata = wsMetadata.get(socket);
        if (!metadata) return;
        //-----------------------
        const parsedData  = JSON.parse(data.toString());
        const {content , receiverId} = parsedData;

      const message = {
        //@ts-ignore
        user:  metadata.userId, // Attach user information to the message
        //data,
        content
      };
      console.log('message: ',message)

      if (metadata.roomCode) {
        // Room-based chat
        const room = rooms.get(metadata.roomCode);
        if (room) {
            room.forEach((client:any) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(message), { binary: isBinary });
                }
            });
        }
    }
    else if (metadata.directChatUserId) {
        // 1-1 chat
        let recipientSocket;
        for (const [clientSocket, clientMetadata] of wsMetadata.entries()) {
            if (clientMetadata.userId === receiverId) {
                recipientSocket = clientSocket;
                break;
            }
        }

        if (recipientSocket && recipientSocket.readyState === recipientSocket.OPEN) {
            recipientSocket.send(JSON.stringify(message), { binary: isBinary });
        } else {
            console.log('Recipient not connected or connection is closed');
        }
    }

      //rooms login
      //@ts-ignore
        // const room = rooms.get(metadata.roomCode)
        // if (room) {
        //     room.forEach((client:any) => {
        //         if (client.readyState === client.OPEN) {
        //             client.send(JSON.stringify(message), { binary: isBinary });
        //         }
        //     });
        // }else{
        //     console.log('nah i would wiin');
        //     console.log(wsMetadata.get(socket));
        // }
    });
    socket.on('close', () => {
        const metadata = wsMetadata.get(socket);
        if (!metadata) return;

        if (metadata.roomCode) {
            const room = rooms.get(metadata.roomCode);
            if (room) {
                room.delete(socket);
                if (room.size === 0) {
                    rooms.delete(metadata.roomCode);
                }
            }
        }

        wsMetadata.delete(socket);
    });
  
    socket.send('Connection Established!!');
  });
