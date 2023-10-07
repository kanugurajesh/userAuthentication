import { Request, Response } from "express";
import UserSchema from "../models/auth"
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";
import path from "path";

// IMPORTING THE DOTENV CONFIG
dotenv.config();

// IMPORTING THE GMAIL SECRET KEYS
const GMAIL_ID = process.env.GMAIL_ID;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

// IMPORTING THE FILE PATH
const FILE_PATH = path.join(__dirname,"../forgetemail.json");

// CREATING THE TRANSPORTER 
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:GMAIL_ID,
        pass:GMAIL_PASSWORD
    }
})

const sendForgetMail = async (req:Request,res:Response) => {

    // DESCTRUCTURING THE DATA FROM THE REQUEST BODY
    const { email } = req.body;

    // CHECKING IF THE USER ALREADY EXISTS OR NOT
    const existingUser = await UserSchema.findOne({email:email});

    // IF THE USER DOESN'T EXIST THEN RETURN THE ERROR MESSAGE
    if(!existingUser) {
        return res.status(400).json({message:"User does not exist"});
    }

    // SETTING THE PASSWORD DURATION TO 5 MINUTES
    const PASSWORD_DURATION = Date.now() + 5*60*1000;

    // CREATING A RANDOM PASSWORD FOR THE USER
    const AUTH_PASSWORD = uuidv4().toString();

    // SETTING ALL THE MAIL OPTIONS
    const mailOptions = {
        from:GMAIL_ID,
        to:email,
        subject:"Welcome to the world of Programming",
        html:`
            <div style="border:2px solid black; padding:10px; width:50%; margin:auto; margin-top:20px;">
                <h1>Hi ${existingUser.username},</h1>
                <p>You Password Reset Request is succesful enter the below code in website to change your password </p>
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
            "email":email,
            "username":existingUser.username,
            "PASSWORD_DURATION":PASSWORD_DURATION
        }
    }

    // SENDING THE MAIL TO THE USER
    transporter.sendMail(mailOptions,(err,info) => {
        if(err) {
            return res.status(500).json({message:"Internal Server Error"});
        }
    })

    // READING THE DATA FROM THE DATA.JSON
    fs.readFile(FILE_PATH,"utf-8",(err,data) => {
        if(err) {
            // console.log(err);
            return res.status(500).json({message:"Internal Server Error"});
        }

        // PARSING THE DATA.JSON
        const users = JSON.parse(data);
        
        // CREATING A NEW DATA OBJECT
        const newData = {
            ...users,
            ...NEW_USER_OBJECT
        }

        // WRITING THE NEW DATA TO THE DATA.JSON
        fs.writeFile(FILE_PATH,JSON.stringify(newData,null,2),(err) => {
            if(err) {
                console.log(err);
                return res.status(500).json({message:"Internal Server Error"});
            }
            return res.status(200).json({message:"Password Reset Mail sent successfully"});
        })
    })
}

const verifyForgetMail = async (req:Request,res:Response) => {

    // DESTRUCTURING THE DATA FROM THE REQUEST BODY
    const { AUTH_PASSWORD, PASSWORD } = req.body;

    // READING THE DATA FROM THE DATA.JSON
    fs.readFile(FILE_PATH,"utf-8",(err,data) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message:"Internal Server Error"});
        }

        // PARSING THE DATA FROM THE DATA.JSON
        const users = JSON.parse(data);

        // CHECKING IF THE AUTH_PASSWORD EXISTS OR NOT
        if(!users[AUTH_PASSWORD]) {
            return res.status(400).json({message:"Invalid verification code"});
        }

        // DESTRUCTURING THE DATA FROM THE DATA.JSON
        const { username, email, PASSWORD_DURATION } = users[AUTH_PASSWORD];

        // CHECKING IF THE PASSWORD IS EXPIRED OR NOT
        if(Date.now() > PASSWORD_DURATION) {
            return res.status(400).json({message:"Verification code expired"});
        }

        // UPDATING THE PASSWORD IN THE DATABASE
        UserSchema.findOneAndUpdate({email:email},{password:PASSWORD})
            .then(() => {
                // console.log(result);
                const mailOptions = {
                    from:GMAIL_ID,
                    to:email,
                    subject:"Password Updated",
                    html:`
                        <div style="border:2px solid black; padding:10px; width:50%; margin:auto;">
                            <h1>Hi ${username},</h1>
                            <p>"Password Updated"</p>
                            <p>Regards,</p>
                            <p>Rajesh</p>
                        </div>
                    `
                }

                // AFTER THE PASSWORD IS UPDATED A MAIL IS SENT TO THE USER WITH THE SUCCESS MESSAGE
                transporter.sendMail(mailOptions,(err,info) => {
                    if(err) {
                        // console.log(err);
                        return res.status(500).json({message:"Internal Server Error"});
                    }
                })
                return res.status(200).json({message:"Password updated successfully"});
            })
            .catch(() => {
                // console.log(error);
                // IF THE PASSWORD IS NOT UPDATED THEN A MAIL IS SENT TO THE USER WITH THE FAILED MESSAGE
                const mailOptions = {
                    from:GMAIL_ID,
                    to:email,
                    subject:"Password Update Failed",
                    html:`
                        <div style="border:2px solid black; padding:10px; width:50%; margin:auto;">
                            <h1>Hi ${username},</h1>
                            <p>"Password Update Failed"</p>
                            <p>Regards,</p>
                            <p>Rajesh</p>
                        </div>
                    `
                }

                transporter.sendMail(mailOptions,(err,info) => {
                    if(err) {
                        // console.log(err);
                        return res.status(500).json({message:"Internal Server Error"});
                    }
                })
                return res.status(500).json({message:"Internal Server Error"});
            })
        });
    }

// EXPORTING THE FUNCTIONS TO THE ROUTES
export { sendForgetMail, verifyForgetMail };