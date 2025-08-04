import express from 'express'
const router  = express.Router();
import {body} from 'express-validator'
import { getUserProfile, userLogin, userLogout, userRegister } from '../controllers/user.controller.js';
import authUser from '../middleware/auth.middleware.js';

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userRegister);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userLogin
)

router.get("/profile", authUser, getUserProfile)

router.post('/logout', userLogout)

export default router;