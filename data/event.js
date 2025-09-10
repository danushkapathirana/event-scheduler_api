import { v4 as uuidv4 } from "uuid";

import { readData, writeData } from "../services/service.js";
import { NotFoundError } from "../utils/error.js";

export const getAll = async () => {
  const storedEvents = await readData();
  if (!storedEvents.events) {
    throw new NotFoundError("Could not find any events.");
  }
  return storedEvents.events;
};

export const get = async (id) => {
  const storedEvents = await readData();
  if (!storedEvents.events || storedEvents.events.length === 0) {
    throw new NotFoundError("Could not find any events.");
  }

  const event = storedEvents.events.find((event) => event.id === id);
  if (!event) {
    throw new NotFoundError(`Could not find event for id ${id}.`);
  }
  return event;
};

export const add = async (data) => {
  const storedEvents = await readData();
  storedEvents.events.unshift({ ...data, id: uuidv4() });
  await writeData(storedEvents);
};

export const replace = async (id, data) => {
  const storedEvents = await readData();
  if (!storedEvents.events || storedEvents.events.length === 0) {
    throw new NotFoundError("Could not find any events.");
  }

  const index = storedEvents.events.findIndex((event) => event.id === id);
  if (index < 0) {
    throw new NotFoundError(`Could not find event for id ${id}.`);
  }
  storedEvents.events[index] = { ...data, id };
  await writeData(storedEvents);
};

export const remove = async (id) => {
  const storedEvents = await readData();
  const updatedEvents = storedEvents.events.filter((event) => event.id !== id);
  await writeData({ ...storedEvents, events: updatedEvents });
};
