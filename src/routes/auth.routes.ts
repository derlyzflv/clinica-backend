import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { validateCreateUser, validateLogin } from '../middlewares/validate-user.js'

const router: Router = Router()

router.post('/register', validateCreateUser, register)
router.post('/login', validateLogin, login)

export default router