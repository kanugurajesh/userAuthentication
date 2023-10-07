import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// IMPORTING THE DOTENV CONFIG
dotenv.config();

// ACCESSING THE API_KEY FROM THE ENVIRONMENT VARIABLES
const API_KEY = process.env.API_KEY;

// THE BELOW FUNCTION IS USED TO AUTHENTICATE THE USER BEFORE ACCESSING THE ENDPOINTS
const authM = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { AUTH_API_KEY } = req.body;

        if (!AUTH_API_KEY) {
            return res.status(401).json({ message: "API_KEY is missing" });
        }

        if (AUTH_API_KEY !== API_KEY) {
            return res.status(401).json({ message: "API_KEY is incorrect" });
        }

        // If the API_KEY is correct, proceed to the next middleware or route handler.
        next();
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// EXPORTING THE authM FUNCTION TO THE ROUTES
export default authM;