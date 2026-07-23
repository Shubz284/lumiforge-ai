import type { Request, NextFunction, Response } from "express";
import { auth } from "../lib/auth";
import { ErrorResponse } from "../utility/ApiResponse";

export interface AuthedRequest extends Request{
    userId:string
}

export async function requireAuth(req:Request, res:Response, next:NextFunction){
    const session = await auth.api.getSession({
        headers:req.headers as any
    })

    if(!session?.user){
        return res.status(401).json(ErrorResponse("Not authenticated"));
    }
    (req as AuthedRequest).userId = session.user.id;
    next();
}