import { Context } from "elysia";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import hashPassword from "../../utils/hashPassword";
import { StatusCode } from "../../types/types";
const registerController=async({body,set}:Context)=>{
    const {email,password}=body as {email:string,password:string};
    const hashedPassword=await hashPassword(password);
    try {
        await db.insert(users).values({email, password: hashedPassword});
        set.status=StatusCode.CREATED;
        return {message:"User registered successfully"};
    } catch (error) {
        set.status=StatusCode.INTERNAL_SERVER_ERROR;
        return {message:"Error registering user",error}; 
    }
}
export default registerController;