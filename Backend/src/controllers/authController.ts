import { Request, Response } from 'express';
import UserSchema from '../models/auth'
import jwt, { Secret } from 'jsonwebtoken';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import dotenv from 'dotenv';

// IMPORTING THE DOTENV CONFIG
dotenv.config();

// IMPORTING THE SECRET KEY
const SECRET_KEY:Secret = process.env.SECRET_KEY as Secret;

const signin = async (req:Request, res:Response) => {

    // DESTRUCTURING THE DATA FROM THE REQUEST BODY
    const {email, password, checked } = req.body;
    
    // CHECKING IF THE USER ALREADY EXISTS OR NOT
    try {
        // CHECKING THE DATABASE FOR THE USER
        const existingUser = await UserSchema.findOne({email:email});

        // IF THE USER DOESN'T EXIST THEN RETURN THE ERROR MESSAGE
        if(!existingUser) {
            return res.status(404).json({message:"User doesn't exist"});
        }

        // IF THE USER EXISTS THEN CHECK IF THE PASSWORD IS CORRECT OR NOT
        if(existingUser.password !== password) {
            return res.status(400).json({message:"Invalid credentials"});
        }

        // IF THE PASSWORD IS CORRECT THEN GENERATE THE TOKEN
        const salt = genSaltSync(10);
        const hash = hashSync(password,salt);

        // CREATING THE PAYLOAD
        const payload = {
            email:email,
            password:hash
        }

        // SIGNING THE TOKEN
        const token = jwt.sign(payload,SECRET_KEY,{expiresIn:"1h"});

        // SETTING THE COOKIE
        if(checked) {
            res.cookie('token',token);
        }

        // RETURNING THE RESPONSE
        return res.status(200).json({user:existingUser})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong"});
    }
};

// THE BELOW ONE IS USED TO READ THE TOKEN FROM THE COOKIE AND VERIFY IT AND LOGIN THE USER AUTOMATICALLY
const autosignin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        // VERIFYING THE TOKEN
        const decodedToken: any = await new Promise((resolve, reject) => {
            jwt.verify(token, SECRET_KEY, (err:any, decoded:any) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        // ASSIGNING THE EMAIL FROM THE DECODED TOKEN
        const email = decodedToken.email;

        // CHECKING IF THE USER ALREADY EXISTS OR NOT
        const existingUser = await UserSchema.findOne({ email: email });

        // IF THE USER DOESN'T EXIST THEN RETURN THE ERROR MESSAGE
        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // IF THE USER EXISTS THEN CHECK IF THE PASSWORD IS CORRECT OR NOT
        const hashMatch = compareSync(existingUser.password, decodedToken.password);

        // IF THE PASSWORD IS CORRECT THEN RETURN THE USER
        if (hashMatch) {
            return res.status(200).json({ message: "Logged In" });
        }

        return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// EXPORTING THE FUNCTIONS FOR ROUTES
export { signin, autosignin };