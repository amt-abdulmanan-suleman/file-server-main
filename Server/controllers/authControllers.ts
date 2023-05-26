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
  const emailRegex = /^[a-zA-Z0-9._%+-]+@amalitech\.org$/;
  let role;
  if(emailRegex.test(email)){
    role = "admin"
  }else{
    role = "user"
  }
  try {
    const hashedPassword = await hash(password, 10);

    const {rows} = await db.query("insert into users(name,email,password,role) values ($1, $2, $3, $4) returning id,email", [
      name,
      email,
      hashedPassword,
      role
    ]);
    await sendVerificationEmail(rows[0].id,rows[0].email)
    return res.status(201).json({
      success: true,
      message: "Verification Token Sent",
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
      .json({
        id: user.id,
        token:token,
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


export const logOut = async (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json({
        success: true,
        message: 'Logged Out',
      });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};

export const resetToken = async(req:Request,res:Response) =>{
  const {email} = req.body;

  try {
    const {rows} = await db.query('select id from users where email = $1',[email]);

    if(rows[0]){
      await sendVerificationEmail(rows[0].id,email)
      res.status(200).json({
        success:true,
        data:{id:rows[0].id,email},
        message:'Reset Verification Token Sent'
      })
    }else{
      res.status(500).json({
        success:false,
        message:'Invalid email'
      })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}

export const resetPassword = async(req:Request,res:Response) =>{
  const {id} = req.params
  const {password} = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    await db.query('update users set password = $1 where id = $2',[hashedPassword,id]);

    res.status(200).json({
      success:true,
      message:'Password reset successful'
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

}