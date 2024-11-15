import expres from 'express';
import { signin } from '../controllers/admin/adminController';


const router = expres.Router()


router.post('/signin', signin)


export default router;