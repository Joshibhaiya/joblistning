import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createJobController,deleteJobController,getAllJobsController, getAllJobsControllerBYUser, getJobByIdController,updateJobController,deleteAllJobsController } from '../controllers/jobsController.js'



const router = express.Router()


// routes 

// create the job
router.post("/job-create",userAuth,createJobController)
//get all jobs
router.get("/jobs", getAllJobsController);
//get all jobs by user
router.get("/jobsbyuser",userAuth, getAllJobsControllerBYUser);
// get jobs by user id
router.get("/job/getJobByID/:id",userAuth, getJobByIdController);// ocurring the problem in this code
// update the job 
router.patch("/updatejobs/:id", userAuth, updateJobController);
// delete the job
router.delete("/deletejobs/:id", userAuth, deleteJobController);
// Delete all jobs
router.delete("/deletealljobs", userAuth, deleteAllJobsController);






export default router 
