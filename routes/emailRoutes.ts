import express from 'express'
import { verifyEmail } from '../controllers/emailControllers';

const router = express.Router();

router.post('/verify-email/:token',async(req,res,next)=>{
    const { token } = req.params;
    try {
        await verifyEmail(token);
        res.status(200).json({
            success:true,
            message:'Verification successful'
        })
        
    } catch (error) {
        next(error);
    }
})
export default router;