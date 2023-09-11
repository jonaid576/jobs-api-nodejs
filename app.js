require('dotenv').config()
require('express-async-errors')
const express = require('express')
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const { rateLimit } = require("express-rate-limit")
const { router: authRouter } = require("./routes/auth")
const { router: jobRouter } = require("./routes/jobs")
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const { authMiddleware } = require('./middleware/authentication')

const app = express()
app.set('trust proxy', 1)


const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

// extra packages
app.use(limiter)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(express.json())

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authMiddleware, jobRouter)

// error handler
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log("connected to DB")
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
