const express = require("express")
require("dotenv").config()
const bodyParser = require("body-parser")

const routes = require("./routes/event")

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    next()
})

app.use("/events", routes)

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message || "Something went wrong."
    res.status(status).json({message: message})
})

app.listen(process.env.PORT || 9000, () => {
    console.log("server started")
})


/**
 * libraries
 * 
 * npm install uuid
 */
