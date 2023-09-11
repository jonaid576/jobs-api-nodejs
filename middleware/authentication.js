const { UnauthenticatedError } = require("../errors")
const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid Credentials with noAuthHeader")
    }
    const token = authHeader.split(" ")[1]
    // console.log(token)
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(payload)
        req.user = { id: payload.userId }
        next()
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid Credentials with token")
    }
}

module.exports = { authMiddleware }