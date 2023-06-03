import express,{Request,Response} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import passport from 'passport';
import cors from 'cors'

import { PORT } from './config';

import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import fileRoutes from './routes/fileRoutes'
import emailRoutes from './routes/emailRoutes'
import './middlewares/passport-middleware'

const app = express();

app.use(cors())
/* Middleware to parse the body from requests*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'));
 

app.use(cookieParser())

app.use(passport.initialize())

app.use('/auth',authRoutes);

app.use('/user',userRoutes);

app.use('/admin',adminRoutes);

app.use('/api/files',fileRoutes)
app.use('/',emailRoutes);
app.get('/',(req:Request,res:Response)=>{
    res.send(
       "<h1>Welcome to the File Server<h1/>"
    )
})

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`)
})