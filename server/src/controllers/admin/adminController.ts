import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

export const signin = async (req: Request, res: Response): Promise<any> => {

    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ success: false, message: 'email and password are required'})
        }

        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASS) {
            return res.status(400).json({success: false, message: 'invalid emil or password'})
        }

        const accessTokenAdmin = jwt.sign(
            { admin: process.env.ADMIN_EMAIL },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        const refreshTokenAdmin = jwt.sign(
            { admin: process.env.ADMIN_EMAIL },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );

        res.cookie("refreshTokenAdmin", refreshTokenAdmin, {
            httpOnly: true,
            secure: true, 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: accessTokenAdmin,
        });


    } catch (error) {
        console.log('error during signup', error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}