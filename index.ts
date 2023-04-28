import express from 'express';
import bodyParser from 'body-parser';

import { PORT } from './config';

import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const app = express();

/* Middleware to parse the body from requests*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use('/auth',authRoutes);

app.use('/user',userRoutes);

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`)
})