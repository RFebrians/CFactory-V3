import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
  id: string;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = (req.headers["authorization"] || req.headers["token"]) as string; // Ensure token is a string

  if (!token) {
    res.status(401).json({ success: false, message: "Not Authorized, Token Missing, Login Again" });
    return;
  }

  try {
    // If token is in Authorization header with "Bearer ", remove the prefix
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing from environment variables");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as unknown as DecodedToken;

    if (!decoded.id) {
      throw new Error("Token does not contain a valid user ID");
    }

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("JWT Error:", error instanceof Error ? error.message : error);
    res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authMiddleware;
