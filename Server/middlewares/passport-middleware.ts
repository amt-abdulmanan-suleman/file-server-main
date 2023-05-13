import { Request } from "express";
import passport from "passport";
import { Strategy,ExtractJwt } from "passport-jwt";
import { SECRET } from "../config";
import db from "../db";



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
    new Strategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:SECRET,
    },async({id},done)=>{
        try {
            const {rows} = await db.query('select * from users where id = $1',[id])
            if(!rows.length){
                return done(null,false)
            }
            let user = rows[0]

            return  done(null,user)
        } catch (error) {
            console.log(error)
            done(null,false)
        }
    })
)

