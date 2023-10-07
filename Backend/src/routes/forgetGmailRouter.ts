import express from 'express';
import { sendForgetMail, verifyForgetMail } from '../controllers/forgetGmailController';
import authM from '../middleware/authM';

// DEFINING THE USER ROUTER
const userRouter = express.Router();

// THE BELOW ENDPOINTS ARE USED TO SEND THE FORGET PASSWORD MAIL
userRouter.post('/sendForgetMail', authM,sendForgetMail);
userRouter.post('/verifyForgetMail', authM,verifyForgetMail);

// EXPORTING THE USER ROUTER
export default userRouter;