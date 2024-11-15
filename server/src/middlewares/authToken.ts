import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import pool from "../db";

interface TokenValidationResult {
  success: boolean;
  message: string;
  userId?: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const refreshAccessToken = (req: Request, res: Response): any => {

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };

    if (!payload.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({ success: true, token: newAccessToken });
  } catch (error) {
    console.error("Error while refreshing access token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};



export const validateToken = async (token: string): Promise<TokenValidationResult> => {

  if (!token) {
    return {
      success: false,
      message: "Token not provided",
    };
  }


  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as { userId: string };

    // console.log(payload)

    return {
      success: true,
      message: "Token is valid",
      userId: payload.userId,
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        success: false,
        message: "Token expired",
      };
    }
    console.error("Token validation error:", error);
    return {
      success: false,
      message: "Invalid token",
    };
  }
};

export const checkTokenValidity = async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1];
    const validationResult = await validateToken(token);

    if (validationResult.success) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [
            validationResult.userId,
          ]);
        const user = result.rows[0]  
        if(!user) {
            return res.status(200).json({
                success: false,
                message: "user not found",
              });
        }
      return res.status(200).json({
        success: true,
        message: "Token is valid",
        user: user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: validationResult.message,
      });
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1];
    const validationResult = await validateToken(token);

    if (validationResult.success) {
      req.user = { userId: validationResult.userId! };
      return next();
    } else {
      return res.status(401).json({
        success: false,
        message: validationResult.message,
      });
    }
  } catch (error) {
    console.error("Protection middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const refreshToken = async (req: Request, res: Response) => {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "No refresh token",
        });
      }
  
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: string };
  
      // Get user data
      const user = await pool.query("SELECT * FROM users WHERE id = $1", [
        decoded.userId,
      ]);
  
      if (!user.rows[0]) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.rows[0].id, email: user.rows[0].email },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      );
  
      // Return new access token and user data
      return res.json({
        success: true,
        accessToken,
        user: {
          id: user.rows[0].id,
          email: user.rows[0].email,
          // ... other user fields
        },
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  };
