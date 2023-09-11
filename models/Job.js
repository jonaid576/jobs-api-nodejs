const mongoose = require("mongoose")
const { Schema } = mongoose

const JobSchema = new Schema({
    company: {
        type: String,
        required: [true, "Please! provide the company name"],
    },
    position: {
        type: String,
        required: [true, "Please! provide the position"],
    },
    status: {
        type: String,
        enum: ["pending", "interview", "closed"],
        default: "pending"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please! provide the created by"],
    }
}, { timestamps: true })

module.exports = mongoose.model('Job', JobSchema)