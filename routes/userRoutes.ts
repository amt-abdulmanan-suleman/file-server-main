import express from 'express';

const router = express.Router();

import { getAllUsers,getUser,updateUser,deleteUser} from '../controllers/userControllers';

router.get("/",getAllUsers)

router.get("/:id",getUser).put("/:id",updateUser).delete("/:id",deleteUser)



export default router;