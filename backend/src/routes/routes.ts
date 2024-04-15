import express, { Request, Response } from 'express';
import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';
const app = express();
const router = express.Router();
const prisma = new PrismaClient();
import JWT_SECRET  from '../config'




router.post('/login' , async (req : any,res : Response)=>{
    // const {username , password} = req.body;
    const username = req.body.username;
    const password = req.body.password;
    const user  = await prisma.user.findUnique({
        where: {
            username
        }
    })

    console.log('USER: ', user, user?.id);
    const userId = user?.id;

    if(!user){
        try{

            const user = await prisma.user.create({
                data : {
                    username,
                    password
                }
            })
            const userId = user.id;
            const token = jwt.sign({
                userId
            }, "JWT_SECRET");
            
            res.json({
                token,
                user
            })
        }catch(err){
            console.log(err);
            res.json({
                message: "user not created error encountered"
            })
        }
    }

    const token = jwt.sign({
        userId
    }, "JWT_SECRET");

    return res.json({
        token,
        user
    })

})


export default router