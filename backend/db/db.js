import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB = async ()=>{
    try {
       const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log("MongoDB connected to host:", conn.connection.host);
        console.log("Database name:", conn.connection.name);

       
    } catch (error) {
        console.log(error);
        process.exit(1);
        
    }
}
export default ConnectDB;