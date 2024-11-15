import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();


const app = express();

const corsOptions = { 
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

import userRoute from './routes/userRoutes';
import adminRoute from './routes/adminRoutes'
app.use('/', userRoute)
app.use('/admin/', adminRoute)

const port = process.env.PORT || 5000


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 