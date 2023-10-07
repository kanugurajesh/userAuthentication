import express from 'express';
import authM from '../middleware/authM';
import { sendMail, verifyMail } from '../controllers/gmailController';
// Init router and path
const gmailRouter = express.Router();

// Add sub-routes
gmailRouter.post('/sendMail', authM, sendMail);
gmailRouter.post('/verifyMail', authM, verifyMail);

// Export the base-router
export default gmailRouter;