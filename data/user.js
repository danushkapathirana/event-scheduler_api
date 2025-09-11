import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";

import { readData, writeData } from "../services/service.js";
import { NotFoundError } from "../utils/error.js";

export const add = async (data) => {
  const storedUsers = await readData();
  const generatedUserId = uuidv4();
  const hashedPassword = await hash(data.password, 12);

  if (!storedUsers.users) {
    storedUsers.users = [];
  }

  storedUsers.users.push({
    ...data,
    password: hashedPassword,
    id: generatedUserId,
  });
  await writeData(storedUsers);
  return { id: generatedUserId, email: data.email };
};

export const get = async (email) => {
  const storedUsers = await readData();

  if (!storedUsers.users || storedUsers.users.length === 0) {
    throw new NotFoundError("Could not find any users.");
  }

  const user = storedUsers.users.find((user) => user.email === email);
  if (!user) {
    throw new NotFoundError(`Could not find user for email ${email}.`);
  }
  return user;
};
