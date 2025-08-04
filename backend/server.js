// We will be using WebSocket here for real time notification, location detection and all
import http from 'http'
import app from './app.js';


const server = http.createServer(app);


server.listen(process.env.PORT,()=>{
    console.log(`Server Listening on port ${process.env.PORT}`);
    
})