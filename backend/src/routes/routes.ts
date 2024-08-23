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

        return res.json({
            token,
            user
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

router.get('/chat',(req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    console.log('inside function', userId);
    res.status(200).send('Setup completed');
})


//---------------------------------------Friend Request-------------------------------------

router.post('/friendRequest' , async(req,res)=>{
    const {senderId , receiverMail } = req.body;  

    try{
        const receiver = await prisma.user.findUnique({
            where: {
                username: receiverMail,
            },
        });

        if(!receiver){
            return res.status(404).json({
                error: "user not found"
            })
        }

        const existingFriendRequest = await prisma.friendRequest.findFirst({
            where : {
                senderId : senderId,
                receiverId: receiver.id,
                status : 'PENDING'
            }
        })

        if(existingFriendRequest){
            return res.status(400).json({
                error: "Request Already Sent"
            })
        }

        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderId : senderId,
                receiverId : receiver.id
            }
        })

        return res.status(201).json({
            friendRequest
        })

    }catch(e){
        console.log(e);
        res.status(411).json({
            error: "Request Failed !"
        })
    }
})

//-----------------Get friend requests:

router.get('/friendRequest' , async(req,res)=>{
    const receiverId = req.query.receiverId as string;
    if (!receiverId) {
        return res.status(400).json({ error: 'Sender ID is required' });
    }
    try{
        const friendRequests = await prisma.friendRequest.findMany({
            where: {
                receiverId,
                status: 'PENDING',
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return res.json(friendRequests);
    }catch(e){
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
})


//---------------------------------------------------FRIENDS---------------------------------
router.post('/acceptRequest' , async(req,res)=>{
    const {senderId , receiverId} = req.body;
    try{
        await prisma.$transaction( async tx =>{
            const user = await tx.user.findFirst({
                where : {
                    id: receiverId // since it is received by current user
                }
            })
            if(!user){
                return res.status(404).json({
                    error: "User not Found"
                })
            }

            const friendReq = await tx.friendRequest.findFirst({
                where : {
                    senderId,
                    receiverId,
                    status: 'PENDING'
                }
            })

            if(!friendReq){
                return res.status(404).json({
                    error: "Friend Reqeust not Found Send Again"
                })
            }
            await tx.friendRequest.update({
                where: { id: friendReq.id },
                data: { status: 'ACCEPTED' },
            });


            await tx.friends.create({
                data: {
                  userId: receiverId,
                  friendId: senderId,
                },
              });
        
              await tx.friends.create({
                data: {
                  userId: senderId,
                  friendId: receiverId,
                },
              });

              return res.status(200).json({
                message: "Friend request accepted successfully",
              });

        })
    }catch(e){
        console.error(e);
        return res.status(500).json({
        error: "An error occurred while accepting the friend request",
        });
    }
})

router.post('/declineRequest', async (req, res) => {
    const { senderId, receiverId } = req.body;
  
    try {
      await prisma.friendRequest.updateMany({
        where: { senderId, receiverId, status: 'PENDING' },
        data: { status: 'REJECTED' },
      });
  
      return res.status(200).json({ message: "Friend request declined" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "An error occurred while declining the friend request" });
    }
});


router.get('/friends' ,async (req,res)=>{
    const userId = req.query.userId as string;
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    if(!user){
        return res.status(404).json({
            error: "User doesn't exist"
        })
    }

    try{
        const friends = await prisma.friends.findMany({
            where: { userId: user.id },
            include: {
                friend: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return res.json({
            friends
        })
    }catch(e){
        console.log('error while getting friends',e);
        return res.status(500).json({
            error: "Internal Server Error while Getting Friends"
        })
    }

})

//-------------------------------------GET OR CREATE ROOMS-------------------------------------------------------
router.post('/getOrCreateRoom' , async(req,res)=>{
    const { userId , friendId } = req.body;
    try {
        const isFriendshipExist = await prisma.friends.findFirst({
            where : {
             OR :[
                    {userId,friendId},
                    {userId: friendId , friendId :userId}
                ]
            }
        })
        if(!isFriendshipExist){
            return res.status(403).json({
                error: "you are not friends with this user"
            })  
        }

        let rooms = await prisma.room.findMany({
            where : {
                isGroup : false,
                participants : {
                    every: {
                        id: {
                            in: [userId, friendId],
                        },
                    },
                }
            },
            include : {
                participants: true
            }
        })
        let room = rooms.find((r) => r.participants.length === 2);

        if(!room){
            room = await prisma.room.create({
                data: {
                    isGroup : false,
                    participants : {
                        connect : [{id: userId}, {id: friendId}]
                    }
                },
                include: {
                    participants: true
                }
            })
        }
        return res.json({room})
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error : "Internal Server Error "})
    }   
})

//-------------------------------------------- SEND OR RECIEVE MESSAGE---------------------------------
router.post('/sendMessage' , async (req,res)=>{
    const { roomId, senderId, receiverId, content } = req.body;

    if (!roomId || !senderId || !receiverId || !content) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const room = await prisma.room.findUnique({
        where: { id: roomId },
    });
    
    if (!room) {
        return res.status(400).json({ error: "Room does not exist" });
    }

    try{
        const message =  await prisma.message.create({
            data : {
                content,
                senderId,
                receiverId,
                roomId,
                sentAt: new Date().toISOString(),
            }
        })
        return res.status(201).json({message});
    }catch(e){
        console.log('Message not delivered',e);
        return res.status(500).json({error: "internal server error , Message not delivered"})
    }
})

//-------------------------------------------------------FETCH MESSAGE----------------------------------
router.get('/fetchMessage', async (req,res)=>{
    const roomId  = req.query.roomId as string;
    if (!roomId) {
        return res.status(400).json({ error: "Room ID is required" });
    }
    try {
        const messages = await prisma.message.findMany({
            where: { roomId: roomId },
            orderBy: { sentAt: 'asc' },
            include: {
                sender: {
                    select: { name: true }, // Including sender's name
                },
                receiver: {
                    select: { name: true }, // Including receiver's name
                },
            },
        });

        return res.status(200).json({ messages });
    } catch (e) {
        console.error('Error fetching messages', e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;