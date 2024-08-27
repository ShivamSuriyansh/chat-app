import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import router from './routes/routes';
import { userAuth } from './middleware/auth';
import { JWT_SECRET } from './config';

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/user', userAuth, router);

const httpServer = app.listen(8080);
export const wss = new WebSocketServer({ noServer: true });

const rooms = new Map<string, Set<WebSocket>>();  // Map room codes to sets of WebSocket connections
const wsMetadata = new Map<WebSocket, any>();     // Map WebSocket connections to metadata

const prisma = new PrismaClient();

httpServer.on('upgrade', (request, socket, head) => {
    const url = request.url ?? '/';
    const pathname = new URL(url, `http://${request.headers.host}`).pathname;

    if (pathname === '/user/chat') {
        const params = new URLSearchParams(request.url?.split('?')[1]);
        const token = params.get('token');
        const roomCode = params.get('room');
        const directChatUserId = params.get('directChatUserId');

        if (!token) {
            socket.destroy();
            return;
        }

        try {
            const verified = jwt.verify(token, JWT_SECRET);
            const metadata = {
                userId: (verified as any).id,
                roomCode: roomCode || null,
                directChatUserId: directChatUserId || null,
            };

            wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
                wsMetadata.set(ws, metadata);

                if (roomCode) {
                    if (!rooms.has(roomCode)) {
                        rooms.set(roomCode, new Set());
                    }
                    rooms.get(roomCode)?.add(ws);
                }

                wss.emit('connection', ws, request);
            });
        } catch (e) {
            console.error('Authentication error:', e);
            socket.destroy();
        }
    } else {
        socket.destroy();
    }
});

wss.on('connection', (socket: WebSocket) => {
    console.log('New WebSocket connection');

    socket.on('error', (err) => console.error(err));

    socket.on('message', async (data, isBinary: boolean) => {
        const metadata = wsMetadata.get(socket);
        if (!metadata) return;

        const parsedData = JSON.parse(data.toString());
        const { content, roomId, senderId, receiverId } = parsedData;

        const message = {
            ...parsedData
        };

        if (roomId) {
            // Room-based chat
            console.log('Handling room-based chat for roomId:', roomId);
            const room = await prisma.room.findUnique({
                where: { id: roomId },
                include: { participants: true },
            });

            if (room) {
                console.log('broadcasting in room: ',room)
                room.participants.forEach((participant) => {
                    // Find the WebSocket for the participant
                    const clientSocket = Array.from(wsMetadata.entries()).find(([clientSocket, metadata]) => metadata.userId === participant.id)?.[0];
                    // console.log(clientSocket);
                    if (clientSocket && clientSocket.readyState === clientSocket.OPEN) {
                        console.log('client socket broadcasting: ')
                        clientSocket.send(JSON.stringify(message), { binary: isBinary });
                    }
                });
            } else {
                console.log('Room not found in database');
            }
        } else if (metadata.directChatUserId) {
            // 1-1 chat
            console.log('Handling direct chat for userId:', metadata.directChatUserId);
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
        } else {
            // Broadcast to all clients if neither roomId nor directChatUserId is set
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(message), { binary: isBinary });
                }
            });
        }
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
