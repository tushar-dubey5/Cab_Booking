// We will be using WebSocket here for real time notification, location detection and all
import http from 'http'
import app from './app.js';
import ConnectDB from './db/db.js';
import { error } from 'console';


const server = http.createServer(app);

ConnectDB()
.then(()=>{
    server.listen(process.env.PORT, ()=>{
        console.log(`server listening on port ${process.env.PORT}`);
        
    })
})
.catch((error)=>{
    console.log("Error occurred while starter server ", error);
    
})