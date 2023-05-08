import passport, { AuthenticateOptions } from "passport";
import { Request, Response, NextFunction } from "express";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthError {
  message: string;
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: AuthError, user: User | false, info: AuthenticateOptions) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Unauthorized access: you must be logged in" });
      }
      if (user.role !== "admin") {
        return res
          .status(401)
          .json({ message: "Unauthorized access: you must be an admin to perform this action" });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
