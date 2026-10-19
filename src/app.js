import express from "express"
const app=express();

//middleware
app.use(express.json());

//cookei parser
import cookieParser from "cookie-parser";
app.use(cookieParser())

//routes import
import  {userRouter} from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users",userRouter)

//http://localhost:3000/api/v1/users/register
export {app};