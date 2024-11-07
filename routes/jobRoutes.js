import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createJobController,deleteJobController,getAllJobsController, getJobByIdController,updateJobController,deleteAllJobsController, jobStatsController } from '../controllers/jobsController.js'



const router = express.Router()


// routes 

// create the job
router.post("/job-create",userAuth,createJobController)
//GET JOBS || GET
router.get("/get-job", userAuth, getAllJobsController);
// get jobs by user id
router.get("/job/getJobByID/:id",userAuth, getJobByIdController);// ocurring the problem in 
// update the job 
router.patch("/updatejobs/:id", userAuth, updateJobController);
// delete the job
router.delete("/deletejobs/:id", userAuth, deleteJobController);
// Delete all jobs
router.delete("/deletealljobs", userAuth, deleteAllJobsController);
// Jobs fillter stats || GEt
router.get("/job-stats", userAuth, jobStatsController);





export default router 
