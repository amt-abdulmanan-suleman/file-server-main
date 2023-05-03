import { Request } from "express";
import passport from "passport";
import { Strategy } from "passport-jwt";
import { SECRET } from "../config";
import db from "../db";

interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; name:string
        created_at:Date };
  }

const cookieExtractor = (req:Request)=>{
    let token = null
    if(req&&req.cookies) token = req.cookies['token']
    return token
}

const opts = {
    secretOrKey:SECRET,
    jwtFromRequest:cookieExtractor
}

passport.use(
    new Strategy(opts,async({id},done)=>{
        try {
            const {rows} = await db.query('select * from users where id = $1',[id])
            if(!rows.length){
                throw new Error('401 Unauthorized User')
            }
            let user = {id:rows[0].id,email:rows[0].email,name:rows[0].name}

            return done(null,user)
        } catch (error) {
            console.log(error)
            return done(null,false)
        }
    })
)

