const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const { Schema } = mongoose
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name must be provided"],
        maxLength: 23,
        minLength: 3,
    },
    password: {
        type: String,
        required: [true, "password must be provided"],
        maxLength: 100,
        minLength: 4,
    },
    email: {
        type: String,
        require: [true, "email must be provided"],
        match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "please provide a valid email"],
        unique: true,
    }
})

userSchema.pre('save', async function () {
    this.password = await bcryptjs.hash(this.password, 10)
})

userSchema.methods.signJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)