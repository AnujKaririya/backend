import dotenv from "dotenv";
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

dotenv.config();

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`mogodb connected ,DB Host:${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log(error);
        console.log("error in db.index.js")
    }
} 
export default connectDB;