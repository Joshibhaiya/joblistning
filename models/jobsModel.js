import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Company name is required"]
    },
    position: {  // corrected spelling
        type: String,
        required: [true, "Position is required"],
        minlength: 2,  // adjusted minlength
    },
    status: {
        type: String,
        enum: ["pending", "reject", "interview"],
        default: "pending"
    },
    WorkType: {
        type: String,
        enum: ["full-time", "part-time", "internship", "contract"],  // corrected spelling
        default: "full-time"
    },
    workLocation: {
        type: String,
        default: "Mumbai",
        required: [true, "Work location is required"]
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });  // added timestamps option

export default mongoose.model("Job", jobSchema);
