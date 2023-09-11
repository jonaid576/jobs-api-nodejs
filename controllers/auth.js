const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const bcryptjs = require("bcryptjs")
const BadRequestError = require("../errors/bad-request")
const UnauthenticatedError = require("../errors/unauthenticated")

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return new BadRequestError("Please! provide email and password.")
    }
    const user = await User.findOne({ email })
    if (!user) {
        return new UnauthenticatedError("Invalid Credentials")
    }
    const passwordIsCorrect = await user.comparePassword(password)
    // console.log(passwordIsCorrect)
    if (!passwordIsCorrect) {
        return new UnauthenticatedError("Invalid Credentials")
    }
    const token = user.signJWT()
    // console.log(token)
    res.status(StatusCodes.OK).send({ name: user.name, token })
}

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.signJWT()
    res.status(StatusCodes.CREATED).json({ name: user.name, token })
}

module.exports = {
    login,
    register
}