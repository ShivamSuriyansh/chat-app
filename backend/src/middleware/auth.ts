import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config";

interface AuthenticatedRequest extends Request {
    userId?: string; // Add userId property
}

export const userAuth = (req:AuthenticatedRequest , res:Response , next:NextFunction)=>{
    const token = req.query.token as string;
    console.log(token);
    const verified = jwt.verify(token, JWT_SECRET);
    console.log("verified: ",verified);
    //@ts-ignores
    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, JWT_SECRET) as { id: string };
        console.log("verified: ", verified);

        // Attach userId to the request
        req.userId = verified.id;
        next();
    } catch (e) {
        console.error('Authentication error:', e);
        return res.status(403).json({ error: "Not Authorised" });
    }
}