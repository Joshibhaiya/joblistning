import express from "express"
import { registrationController } from "../controllers/authController.js"
import { loginController } from "../controllers/authController.js"
import { getAllUsersController } from "../controllers/authController.js"



import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// router object
const router = express.Router()

//routes
router.post("/registration",limiter,registrationController)
router.post("/Login",limiter,loginController)
router.get("/get",getAllUsersController)

//export
export default router