import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from 'jsonwebtoken'

interface AuthenticatedAdminRequest extends Request {
    admin: {
      admin: string;
    };
  }

  interface TokenValidationResult {
    success: boolean;
    message: string;
  }

export const refreshAdminAccessToken = (req: Request, res: Response): any => {
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
      ) as { admin: string };
  
      if (!payload.admin) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid refresh token" });
      }
  
      const newAccessToken = jwt.sign(
        { admin: payload.admin },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      );
  
      return res.status(200).json({ success: true, token: newAccessToken });
    } catch (error) {
      console.error("Error while refreshing admin access token:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
  
  export const validateAdminToken = async (token: string): Promise<TokenValidationResult> => {
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
      ) as { adminId: string };
  
      return {
        success: true,
        message: "Token is valid",

      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return {
          success: false,
          message: "Token expired",
        };
      }
      console.error("Admin token validation error:", error);
      return {
        success: false,
        message: "Invalid token",
      };
    }
  };
  
  export const protectAdminRoute = async (
    req: AuthenticatedAdminRequest,
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
      const validationResult = await validateAdminToken(token);
  
      if (validationResult.success) {
        return next();
      } else {
        return res.status(401).json({
          success: false,
          message: validationResult.message,
        });
      }
    } catch (error) {
      console.error("Admin protection middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };