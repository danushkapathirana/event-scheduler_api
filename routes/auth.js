const express = require("express")
const router = express.Router()

const { isValidEmail, isValidText } = require("../utils/validation")
const { get, add } = require("../data/user")
const { createJSONToken, isValidPassword } = require("../utils/auth")

router.post("/signup", async(req, res, next) => {
    const data = req.body
    let errors = {}

    if(!isValidEmail(data.email)) {
        errors.email = "Invalid email."
    }
    else {
        try {
            const existingUser = await get(data.email)
            if(existingUser) {
                errors.email = "Email already exists."
            }
        }
        catch(error) {}
    }

    if(!isValidText(data.password, 6)) {
        errors.password = "Invalid password. Password must contain at least 6 characters."
    }

    if(Object.keys(errors).length > 0) {
        return res.status(422).json({message: "User sign up was unsuccessful due to validation constraints.", errors})
    }

    try {
        const createdUser = await add(data)
        const authToken = createJSONToken(createdUser.email)
        res.status(201).json({message: "User addition successful", user: createdUser, token: authToken})
    }
    catch(error) {
        next(error)
    }
})

router.post("/login", async(req, res) => {
    const email = req.body.email
    const password = req.body.password
    let user

    try {
        user = await get(email)
    }
    catch(error) {
        return res.status(401).json({message: "Authentication was unsuccessful."})
    }

    const checkedPassword = await isValidPassword(password, user.password)
    if(!checkedPassword) {
        return res.status(422).json({message: "User sign in was unsuccessful due to validation constraints."})
    }

    const token = createJSONToken(email)
    res.json({token})
})

module.exports = router
