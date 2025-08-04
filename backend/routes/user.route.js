import express from 'express'
const router  = express.Router();
import {body} from 'express-validator'
import { userRegister } from '../controllers/user.controller.js';

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userRegister);

export default router;