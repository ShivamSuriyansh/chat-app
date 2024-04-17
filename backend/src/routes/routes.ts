import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const app = express();
const router = express.Router();
const prisma = new PrismaClient();
// import { JWT_SECRET } from '../config'; // Assuming JWT_SECRET is exported from '../config'

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        let user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    username,
                    password
                }
            });
        }

        const token = jwt.sign({ userId: user.id }, "JWT_SECRET");

        return res.json({
            token,
            user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
