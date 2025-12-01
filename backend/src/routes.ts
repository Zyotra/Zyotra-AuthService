import loginController from "./controllers/auth/loginController";
import registerController from "./controllers/auth/registerController";
import { apiRoute } from "./types/types";

const routes:apiRoute[]=[
    {
        path:"/login",
        method:"post",
        handler:loginController,
        middlewares:[],
        isProtected:false
    },
    {
        path:"/register",
        method:"post",
        handler:registerController,
        middlewares:[],
        isProtected:false
    }
]
export default routes