import { Request, Response } from "express";
import UserSchema from "../models/auth";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";
import path from "path";
import { promisify } from "util";

// IMPORTING THE DOTENV CONFIG
dotenv.config();

// IMPORTING THE GMAIL SECRET KEYS
const GMAIL_ID = process.env.GMAIL_ID;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

// IMPORTING THE FILE PATH
const FILE_PATH = path.join(__dirname,"../data.json");

// CREATING THE TRANSPORTER
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:GMAIL_ID,
        pass:GMAIL_PASSWORD
    }
})

// THE BELOW ONE IS USED TO SEND THE MAIL TO THE USER
const sendMail = async (req:Request,res:Response) => {
    console.log("in sendmail")
    // DESCTRUCTURING THE DATA FROM THE REQUEST BODY
    const { username, email, password } = req.body;

    // CHECKING IF THE USER ALREADY EXISTS OR NOT
    const existingUser = await UserSchema.findOne({email:email});

    // IF THE USER ALREADY EXISTS THEN RETURN THE ERROR MESSAGE
    if(existingUser) {
        return res.status(400).json({message:"User already exists"});
    }

    // SETTING THE PASSWORD DURATION TO 5 MINUTES
    const PASSWORD_DURATION = Date.now() + 5*60*1000;

    // CREATING A RANDOM PASSWORD FOR THE USER
    const AUTH_PASSWORD = uuidv4().toString();

    // SETTING ALL THE MAIL OPTIONS
    const mailOptions = {
        from:GMAIL_ID,
        to:email,
        subject:"🎉 Welcome to yaarit",
        html:`
            <div style="border:2px solid black; padding:10px; width:50%; margin:auto;">
                <h1>👋 ${username},</h1>
                <p>😀 Thank you for registering on my website.</p>
                <p>Your verification code is ${AUTH_PASSWORD}</p>
                <p>This password will be valid for 5 minutes only.</p>
                <p>Regards,</p>
                <p>Rajesh</p>
            </div>
        `
    }

    // CREATING A NEW USER OBJECT
    const NEW_USER_OBJECT = {
        [AUTH_PASSWORD]: {
            "username":username,
            "email":email,
            "password":password,
            "PASSWORD_DURATION":PASSWORD_DURATION
        }
    }

    // SENDING THE MAIL TO THE USER
    transporter.sendMail(mailOptions,(err,info) => {
        if(err) {
            // console.log(err);
            return res.status(400).json({message:"Mail not sent"});
        }
        return res.status(200).json({message:"Mail sent successfully"});
    })

    // CREATING THE PROMISES FOR THE FILE SYSTEM
    const readFilePromise = promisify(fs.readFile);
    const writeFilePromise = promisify(fs.writeFile);

    // READING THE DATA FROM THE DATA.JSON
    const data = await readFilePromise(FILE_PATH,"utf-8");

    // PARSING THE DATA FROM THE DATA.JSON
    const users = JSON.parse(data);

    // ADDING THE NEW USER OBJECT TO THE DATA.JSON
    const newData = {
        ...users,
        ...NEW_USER_OBJECT
    }

    // REWRITING THE DATA.JSON WITH THE NEW DATA
    await writeFilePromise(FILE_PATH,JSON.stringify(newData,null,2));
    return res.status(200).json({message:"Mail sent successfully"});
}


// THE BELOW ONE IS USED TO VERIFY THE MAIL OF THE USER
const verifyMail = async (req:Request,res:Response) => {

    // DESCTRUCTURING THE DATA FROM THE REQUEST BODY
    const { email, AUTH_PASSWORD } = req.body;

    // CHECKING IF THE USER ALREADY EXISTS OR NOT
    const existingUser = await UserSchema.findOne({email:email});

    // IF THE USER ALREADY EXISTS THEN RETURN THE ERROR MESSAGE
    if(existingUser) {
        return res.status(400).json({message:"User already exists"});
    }

    // READING THE DATA FROM THE DATA.JSON
    fs.readFile(FILE_PATH,"utf-8",(err,data) => {

        // IF THERE IS AN ERROR THEN RETURN THE ERROR MESSAGE
        if(err) {
            // console.log(err);
            return res.status(400).json({message:"Error in reading the file"});
        }

        // PARSING THE DATA FROM THE DATA.JSON
        const users = JSON.parse(data);

        // CHECKING IF THE AUTH_PASSWORD EXISTS IN THE DATA.JSON
        if(!users[AUTH_PASSWORD]) {
            return res.status(400).json({message:"Invalid verification code"});
        }

        // DESTRUCTURING THE DATA FROM THE DATA.JSON
        const { username, email, password, PASSWORD_DURATION } = users[AUTH_PASSWORD];

        // CHECKING IF THE PASSWORD DURATION IS EXPIRED OR NOT
        if(Date.now() > PASSWORD_DURATION) {
            return res.status(400).json({message:"Verification code expired"});
        }

        // CREATING A NEW USER OBJECT
        const newUser = new UserSchema({
            username:username,
            email:email,
            password:password
        })

        // SAVING THE NEW USER OBJECT TO THE DATABASE
        newUser.save()
            .then((result) => {
                // console.log("User saved successfully");
                const mailOptions = {
                    from:GMAIL_ID,
                    to:email,
                    subject:` 🎉 Congratulations you are now a part of website `,
                    html:`
                        <div style="border:2px solid black; padding:10px; width:50%; margin:auto;">
                            <div style="width:100%;margin:auto;">
                                <h1>👋 ${username},</h1>
                                <p>😀 Your registration is successful.</p>
                                <p>Regards,</p>
                                <p>Rajesh</p>
                            </div>
                        </div>
                    `
                }
                
                // SENDING THE MAIL TO THE USER
                transporter.sendMail(mailOptions,(err,info) => {
                    if(err) {
                        // console.log(err);
                        return res.status(400).json({message:"Mail not sent"});
                    }
                    return res.status(200).json({message:"User registered successfully"});
                })
            })
            .catch((error) => {
                // console.log(error);
                return res.status(400).json({message:"Error in saving the user"});
            }
        )
    })  
}

// EXPORTING THE FUNCTIONS TO THE ROUTES
export {sendMail,verifyMail };