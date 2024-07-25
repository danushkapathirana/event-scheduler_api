const fs = require("node:fs/promises")
const { v4: generatedId } = require("uuid")

const { NotFoundError } = require("../utils/error")

async function readData() {
    const data = await fs.readFile("events.json", "utf8")
    return JSON.parse(data)
}

async function writeData(data) {
    await fs.writeFile("events.json", JSON.stringify(data))
}

async function getAll() {
    const storedData = await readData()
    if(!storedData.events) {
        throw new NotFoundError("Could not find any events.")
    }
    return storedData.events
}

async function get(id) {
    const storedData = await readData()
    if(!storedData.events || storedData.events.length === 0) {
        throw new NotFoundError("Could not find any events.")
    }

    const event = storedData.events.find((event) => event.id === id)
    if(!event) {
        throw new NotFoundError("Could not find event for id " +id)
    }
    return event
}

async function add(data) {
    const storedData = await readData()
    storedData.events.unshift({ ...data, id: generatedId() })
    await writeData(storedData)
}

async function replace(id, data) {
    const storedData = await readData()
    if(!storedData.events || storedData.events.length === 0) {
        throw new NotFoundError("Could not find any events.")
    }

    const index = storedData.events.findIndex((event) => event.id === id)
    if(index < 0) {
        throw new NotFoundError("Could not find event for id " +id)
    }

    storedData.events[index] = { ...data, id }
    await writeData(storedData)
}

async function remove(id) {
    const storedData = await readData()
    const updatedData = storedData.events.filter((event) => event.id !== id)
    await writeData({events: updatedData})
}

exports.getAll = getAll
exports.get = get
exports.add = add
exports.replace = replace
exports.remove = remove
