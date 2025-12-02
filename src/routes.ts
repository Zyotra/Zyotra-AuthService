import loginController from "./controllers/auth/loginController";
import registerController from "./controllers/auth/registerController";
import { apiRoute } from "./types/types";

const routes:apiRoute[]=[
    {
        path:"/login",
        method:"post",
        handler:loginController,
        isProtected:false
    },
    {
        path:"/register",
        method:"post",
        handler:registerController,
        isProtected:false
    }
]
export default routes