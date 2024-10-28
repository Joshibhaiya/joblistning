import { updateUserController } from "../controllers/userController.js";
import userAuth from "../middlewares/authMiddleware.js";
import { getAllUsersController } from "../controllers/userController.js";
import { getUserByIdController} from"../controllers/userController.js"
import express from "express"

// route object
const router = express.Router()

// routes
// GET user get ki hai yai 


// update the user
router.put("/update",userAuth,updateUserController) 
router.get('/users', getAllUsersController);
router.get('/users/:id', getUserByIdController);


export default router;


