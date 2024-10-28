import jobsModel from "../models/jobsModel.js";
import userModel from "../models/userModel.js"


export const createJobController = async (req, res, next) => {
    const { company, position } = req.body;

    if (!company || !position) {
        return next("Please provide all required fields");
    }

    req.body.createdBy = req.user.userId; // corrected typo

    try {
        const job = await jobsModel.create(req.body);
        res.status(201).json({ job });
    } catch (error) {
        next(error); // handle any potential errors
    }
};



// Get all jobs
export const getAllJobsController = async (req, res, next) => {
    try {
        // Find all jobs without filtering by user
        const jobs = await jobsModel.find();

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({ message: "No jobs found" });
        }

        res.status(200).json({ jobs });
    } catch (error) {
        next(error);
    }
};


// get jobs for the particular user

export const getAllJobsControllerBYUser = async (req, res, next) => {
   const jobs = await jobsModel.find({createdBy : req.user.userId});
   res.status(200).json({
    totalJobs:jobs.length,
    jobs,
   });
};




// get jobs by user id
export const getJobByIdController = async (req, res, next) => {
    try {
        const jobId = req.params.id; // Get ID from route parameter
        const job = await jobsModel.findById(jobId); // Find job by ID

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ job });
    } catch (error) {
        // If the error is due to invalid ObjectId, catch and send a 400 response
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid job ID format" });
        }
        next(error);
    }
};



//update the job
// Update job by ID
export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const trimmedId = id.trim(); // Trim any extra whitespace or newline
    const { company, position } = req.body;

    // Validation
    if (!company || !position) {
        return next("Please provide all required fields");
    }

    try {
        // Find job
        const job = await jobsModel.findOne({ _id: trimmedId });

        if (!job) {
            return next(`No job found with this id ${trimmedId}`);
        }

        // Authorization check
        if (req.user.userId !== job.createdBy.toString()) {
            return next("You are not authorized to update this job");
        }

        // Update job
        const updatedJob = await jobsModel.findOneAndUpdate(
            { _id: trimmedId },
            req.body,
            { new: true, runValidators: true }
        );

        // Send response
        res.status(200).json({ updatedJob });
    } catch (error) {
        next(error);
    }
};


// Deleteing this job

export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;
    const trimmedId = id.trim(); // Trim any extra whitespace or newline

    try {
        // Find job
        const job = await jobsModel.findOne({ _id: trimmedId });

        if (!job) {
            return next(`No job found with this id ${trimmedId}`);
        }

        // Authorization check
        if (req.user.userId !== job.createdBy.toString()) {
            return next("You are not authorized to delete this job");
        }

        // Delete job
        await jobsModel.findByIdAndDelete(trimmedId);

        // Send response
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        next(error);
    }
};


// deleting all jobs
export const deleteAllJobsController = async (req, res, next) => {
    try {
        // Delete all jobs created by the authenticated user
        const result = await jobsModel.deleteMany({ createdBy: req.user.userId });

        // Send response
        res.status(200).json({ message: "All jobs deleted successfully", deletedCount: result.deletedCount });
    } catch (error) {
        next(error); // handle any potential errors
    }
};


  



