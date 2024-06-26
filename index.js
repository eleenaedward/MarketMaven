import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import socketIo from 'socket.io';
import http from 'http';

import { connectDB } from './DBconnection';
import securityapiRouter from './routes/securityRouter';
import priceapiRouter from './routes/priceRouter';
import uploadController from './routes/fileUploadRouter';
import userRouter from './routes/users';
import { authenticateJWT } from './middleware/auth'; 




const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
//Using app.use(authenticateJWT); in your main application file configures your Express app to apply the 
//authenticateJWT middleware to all routes. This means that every incoming request 
//to your server will pass through this middleware function before reaching any route handlers.
app.use(authenticateJWT);


// Connect to MongoDB
connectDB();



// Use authenticateJWT for all routes that need authentication
app.use(authenticateJWT);

// Define routes that need authentication
app.use('/api/security', securityapiRouter);
app.use('/api/price', priceapiRouter);
app.use('/api/upload', uploadController);
app.use('/api/users', userRouter);



  // Error handler
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
  });


// Protected route
app.get("/api/protected", authenticateJWT, (req, res) => {
  res.json({ message: "You are authorized!" });
});



server.listen(3004, () => {
    console.log('Server is running on port 3003');
});
