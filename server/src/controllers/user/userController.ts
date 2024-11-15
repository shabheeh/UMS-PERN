import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../../db";
import bcrypt from "bcryptjs"; 
import { User } from "../../db";
 
export const signup = async (req: Request, res: Response): Promise<any> => {
    try {

        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])


        if(result.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User with this email is already exists' })
        }

        

        const hashPassword = await bcrypt.hash(password, 10)

        const insertQuery = `
            INSERT INTO users (email, password, isBlocked)
            VALUES ($1, $2, $3)
            RETURNING id, email, isBlocked
        `;

        const newUser = await pool.query(insertQuery, [email, hashPassword, false])

        if(newUser) {
            return res.status(201).json({ success: true, message: 'User Created Successfully' })
        }else {
            return res.status(400).json({ success: false, message: 'An error occured while signup' })
        }

    } catch (error) {
        console.log('error during signup', error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export const signin = async (req: Request, res: Response): Promise<any> => {
    try {

        const { email, password } = req.body;


        const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
        const user: User = result.rows[0];

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        if (user.isBlocked) {
            return res.status(400).json({ success: false, message: "User is blocked by admin" });
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

 

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: accessToken,
            user: user
        });

    } catch (error) {
        console.error('error during signin', error);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }
};


export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const { id, name, email, phone, imageurl } = req.body;
    try {
        const query = `
            UPDATE users 
            SET 
                name = $1,
                email = $2,
                phone = $3,
                imageurl = $4
            WHERE id = $5
            RETURNING *
        `;
        
        const values = [
            name,
            email, 
            phone,
            imageurl,
            id
        ];

        const result = await pool.query(query, values);
        
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });

    } catch (error: any) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            message: 'Failed to update profile',
            error: error.message 
        });
    }
};
