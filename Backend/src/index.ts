import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
// import authRouter from './routes/RegistrationRoutes/authRouter';
import authRouter from './routes/authRouter'
import gmailRouter from './routes/gmailRouter';
import resetRouter from './routes/forgetGmailRouter';
import mongoose from 'mongoose';

// IMPORTING THE DOTENV CONFIG
dotenv.config();

// CREATING AN EXPRESS APP
const app: Express = express();
const port = process.env.PORT || 3000;

// ASSIGNING THE DATABASE URL
const dbURL:any = process.env.MONGODB_URL;

// INITIALIZING THE STATIC FOLDER
app.use(express.static(path.join(__dirname, '../../Frontend/dist')));

// THE BELOW LINE IS USED TO PARSE THE REQUEST BODY
app.use(express.json())

// DEFINING THE /users ROUTE
app.use("/users", authRouter);

// DEFINING THE /gmail ROUTE
app.use("/register",gmailRouter)

// DEFINING THE /reset ROUTE
app.use("/reset",resetRouter)

// THE BELOW ENDPOINT IS USED TO SERVE THE STATIC FILES
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../Frontend/dist/index.html'));
});

// THE BELOW FUNCTION IS USED TO CONNECT TO THE MONGODB ATLAS AND ONCE IT IS CONNECTED THEN THE SERVER WILL START LISTENING TO THE PORT

mongoose.connect(dbURL).then(()=>{
    app.listen(port,()=>{
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    })
})
.catch((error)=>{
    console.log("hello")
    console.log(error);
})