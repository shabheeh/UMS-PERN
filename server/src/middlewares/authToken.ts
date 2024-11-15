import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export const refreshAccessToken = (req: Request, res: Response): any => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    try {

        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as { userId: string };

        if (!payload.userId) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        return res.status(200).json({ success: true, token: newAccessToken });

    } catch (error) {
        console.error('Error while refreshing access token:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



export const authenticate = (req: Request, res: Response, next: NextFunction): any => {

    console.log
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.status(400).json({ success: false, message: 'Token not provided'})
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { userId: string}

        (req as Request & { user: { userId: string } }).user = payload;

        next();
        

    } catch (error) {
        if(error instanceof TokenExpiredError) {
            return res.status(401).json({ success: false, message: 'Token Expired'})
        }
        console.log('error while token authentication')
        return res.status(500).json({ success: false, message: 'Internal server error'})
    }
}