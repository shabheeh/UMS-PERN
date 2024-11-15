import express from 'express'
import { signin, signup } from '../controllers/user/userController'
import { refreshAccessToken, authenticate } from '../middlewares/authToken'
import { sign } from 'jsonwebtoken'

const router = express.Router()


router.post('/signin', signin)

router.post('/signup', signup)

router.get('/refresh-token', refreshAccessToken)
router.post('/authenticate', authenticate)

router.post('/profile', authenticate )

export default router;