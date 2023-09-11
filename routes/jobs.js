const express = require("express")
const { getAllJobs, createJob, updateJob, deleteJob, getSingleJob } = require("../controllers/jobs")
const router = express.Router()

router.route("/").get(getAllJobs).post(createJob)
router.route("/:id").patch(updateJob).delete(deleteJob).get(getSingleJob)

module.exports = {
    router
}