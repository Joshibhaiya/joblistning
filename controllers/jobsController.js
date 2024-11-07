import mongoose from "mongoose";
import jobsModel from "../models/jobsModel.js";
import userModel from "../models/userModel.js"
import moment from "moment/moment.js";


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



// ======= GET JOBS ===========
export const getAllJobsController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  //conditons for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };
  //logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModel.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 60;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  //jobs count
  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  // const jobs = await jobsModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
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




// make the fillter job

// =======  JOBS STATS & FILTERS ===========
export const jobStatsController = async (req, res) => {
  const stats = await jobsModel.aggregate([
    // search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totlaJob: stats.length, defaultStats, monthlyApplication });
};