import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { wss } from '..';
import { WebSocket } from 'ws'

const router = express.Router();
const prisma = new PrismaClient();
// import { JWT_SECRET } from '../config'; // Assuming JWT_SECRET is exported from '../config'

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        let user = await prisma.user.findUnique({
            where: {
                username,
                password
            }
        });

        if (!user) {
            return res.status(411).json({
                message: "user not found!"
            })
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        const name = user.name;

        return res.json({
            token,
            name
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/signup', async (req,res)=>{
    const { username , password , name} = req.body;
    
    const user = await prisma.user.findFirst({
        where: {
            username,
            password
        }
    })

    if(user){
        return res.status(411).json({
            erro:  "user already exists / invalid email"
        })
    }

    try{
        await prisma.$transaction(async tx =>{
            const user = await tx.user.create({
                data: { 
                    username,
                    password,
                    name
                }
            })
            //@ts-ignore
            req.id = user.id;
            return res.json({
                message: "user created successfully"
            })
        })
    }catch(error){
        console.log(error);
        return res.status(411).json({
            error: "user not created !"
        })
    }

})


//---------------------------------------
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


router.get('/chat',(req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    console.log('inside function', userId);
    res.status(200).send('Setup completed');
})


// wss.on('connection',(socket)=>{
//     socket.on('error', (err)=>console.error(err));
//     //create a new key on socket( unique identifier ) so that on client side we can identify which user send what 
//     const socketWithClientId = new SocketWithClientId(socket);

//     socketWithClientId.socket.on('message',(data , isBinary)=>{
//         const message = {
//             clientId : socketWithClientId.clientId,
//             data 
//         }
//         wss.clients.forEach((client , req)=>{
//             if(client.readyState == WebSocket.OPEN){
//                 // console.log('Client: ',client);
//                 console.log('message: ' , message);
//                 client.send(JSON.stringify(message), {binary: isBinary})
//                 // console.log(data.toString());
//             }
//         })
//     })

//     socket.send('Connection Established!!');
// })



export default router;
