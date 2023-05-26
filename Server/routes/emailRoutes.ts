import express from 'express'
import { verifyEmail } from '../controllers/emailControllers';

const router = express.Router();

router.post('/verify-email/:token',async(req,res,next)=>{
    const { token } = req.params;
    const {type} = req.body
    try {
        const id = await verifyEmail(token);
        res.status(200).json({
            success:true,
            message:`${type} Verification Successful`,
            id
        })
        
    } catch (error) {
        next(error);
    }
})
export default router;