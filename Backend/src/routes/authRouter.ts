import express from 'express';
// import authM from '../../middleware/RegistrationControllers/authM';
import authM from '../middleware/authM';
// import { signin, autosignin } from '../../controllers/RegistrationControllers/authController';
import { signin, autosignin } from '../controllers/authController';

// DEFINING THE USER ROUTER
const userRouter = express.Router();

// THE BELOW ENDPOINTS ARE USED TO SIGNIN THE USER
userRouter.post('/signin', authM, signin);
userRouter.post('/autosignin', authM, autosignin);

// EXPORTING THE USER ROUTER
export default userRouter;