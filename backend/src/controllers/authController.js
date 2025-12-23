import { AppError } from '../../utils/error.js';
import { UserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    const {email, password} = req.body;

    const emailExisted = await UserModel.findOne({email});
    if(emailExisted){
        throw new AppError('E-Mail exists already, please pick a different one.', 400);
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const users = await UserModel.create({
        email,
        password: hashPassword
    })
    res.status(201).json({
        success: true,
        data: users
    });
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    const user = await UserModel.findOne({email});
    if(!user){
        throw new AppError('User not existed!', 400);
    }
    
    const pswMatch = await bcrypt.compare(password, user.password);
    if(!pswMatch){
        throw new AppError('Password has to match',400);
    }
    res.status(201).json({
        success: true,
        data: user
    });
};