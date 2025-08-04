import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))
app.use(express.json({
    limit: "16kb"
}))

//Even when URL contains SPACE or %20 
app.use(express.urlencoded({extended: true}))


//to use static assets
app.use(express.static("public"))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("Hello World")
})

import userRouter from './routes/user.route.js'
app.use("/api/v1/user", userRouter)
export default app;