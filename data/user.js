const { v4: generatedId } = require("uuid")
const { hash } = require("bcryptjs")

const { readData, writeData } = require("./utils")
const { NotFoundError } = require("../utils/error")

async function add(data) {
    const storedData = await readData()
    const userId = generatedId()
    const hashedPassword = await hash(data.password, 12)

    if(!storedData.users) {
        storedData.users = []
    }

    storedData.users.push({...data, password: hashedPassword, id: userId})
    await writeData(storedData)
    return {id: userId, email: data.email}
}

async function get(email) {
    const storedData = await readData()

    if(!storedData.users || storedData.users.length === 0) {
        throw new NotFoundError("Could not find any users.")
    }

    const user = storedData.users.find((user) => user.email === email)
    if(!user) {
        throw new NotFoundError("Could not find user for email " +email)
    }
    return user
}

exports.add = add
exports.get = get
