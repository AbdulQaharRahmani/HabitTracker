import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/error.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const authenticationToken = asyncHandler( async(req, res, next) => {  
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new AppError('Unauthorized: Token missing ', 401);
    }

    const token = authHeader.split(' ')[1]
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded.id){
        throw new AppError('Unauthorized: Invalid token payload', 401)
    }

    req.user = decoded
    next()
})