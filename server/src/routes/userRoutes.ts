import express from 'express'
import { signin, signup, updateProfile } from '../controllers/user/userController'
import { refreshAccessToken, checkTokenValidity, protectRoute } from '../middlewares/authToken'


const router = express.Router()


router.post('/signin', signin)

router.post('/signup', signup)

router.post('/refresh-token', refreshAccessToken)
router.get('/authenticate', checkTokenValidity)

router.put('/profile', protectRoute, updateProfile )

export default router;