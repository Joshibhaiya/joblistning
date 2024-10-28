import express from "express"
import { registrationController } from "../controllers/authController.js"
import { loginController } from "../controllers/authController.js"
import { getAllUsersController } from "../controllers/authController.js"

// router object
const router = express.Router()

//routes
router.post("/registration",registrationController)
router.post("/Login",loginController)
router.get("/get",getAllUsersController)

//export
export default router