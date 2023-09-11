const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.id }).sort("-createdAt")
    // console.log(jobs)
    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const createJob = async (req, res) => {
    const { id } = req.user
    req.body.createdBy = id
    const job = await Job.create({ ...req.body })
    return res.status(StatusCodes.CREATED).json(job)
}

const deleteJob = async (req, res) => {
    const { user: { id: userId }, params: { id: jobId } } = req
    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })
    if (!job) {
        res.status(StatusCodes.BAD_REQUEST).send("No job was found")
    }
    res.status(StatusCodes.OK).json(job)
}

const updateJob = async (req, res) => {
    const { user: { id: userId }, params: { id: jobId }, body } = req
    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, body, { runValidators: true, new: true })
    if (!job) {
        res.status(StatusCodes.BAD_REQUEST).send("No job was found")
    }
    res.status(StatusCodes.OK).json({ job })
}

const getSingleJob = async (req, res) => {
    const { user: { id: userId }, params: { id: jobId } } = req
    // console.log(userId, jobId)
    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    if (!job) {
        res.status(StatusCodes.BAD_REQUEST).send("No job was found")
    }
    res.status(StatusCodes.OK).json({ job })
}

module.exports = {
    getAllJobs,
    createJob,
    deleteJob,
    updateJob,
    getSingleJob
}