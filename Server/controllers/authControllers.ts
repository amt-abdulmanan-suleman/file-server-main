import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import db from "../db";
import { SECRET } from "../config";
import { sendVerificationEmail } from "./emailControllers";
interface User {
    name: string;
    
    password: string;
  }
interface UserWithIdAndEmail extends User {
  id: number;
  email: string;
}

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    const {rows} = await db.query("insert into users(name,email,password,role) values ($1, $2, $3, $4) returning id,email", [
      name,
      email,
      hashedPassword,
      "user"
    ]);
    await sendVerificationEmail(rows[0].id,rows[0].email)
    return res.status(201).json({
      success: true,
      message: "Verification Email sent",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};

export const logIn = async (req: Request, res: Response) => {
  let user = req.user as UserWithIdAndEmail;

  if (!user) {
    throw new Error("User not found");
  }

  let payload = {
    id: user.id,
    email: user.email,
  };

  try {
    if (!SECRET) {
      throw new Error("Secret key is not defined");
    }
    const token = sign(payload, SECRET);

    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        id: user.id,
        success: true,
        message: "Logged In",
      });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};


export const logout =(req:Request,res:Response)=>{
    try {
        res.status(200).clearCookie('token',{httpOnly:true}).json({
            success:true,
            message:'Log out succensfully'
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            error: error.message,
          });
        }
      }
}