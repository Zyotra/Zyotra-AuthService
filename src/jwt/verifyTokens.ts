import jwt from "jsonwebtoken";
import { db } from "../db/client";
import { login_Sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export const verifyAccessToken=async (token:string):Promise<boolean | any>=>{
    try {
        const user=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string);
        if(!user) return false;
        return {
            status:true,
            user
        };
    } catch (error) {
        return false;
    }
}

export const verifyRefreshToken=async (token:string):Promise<boolean>=>{
    try {
        const user=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET as string) as {id:string};
        console.log("User decoded from refresh token:", user);
        if(!user) return false;
        const tokenFound=await db.select().from(login_Sessions).where(eq(login_Sessions.userId,Number(user?.id)));
        if(tokenFound.length===0) return false;
        if(tokenFound[0].expiresAt < new Date()) return false;
        if(tokenFound[0].refreshToken !== token) return false;
        if(!tokenFound[0]) return false;
        return true;
    } catch (error) {
        return false;
    }
}