import { readFile, writeFile } from "node:fs/promises";

export const readData = async () => {
  const data = await readFile("events.json", "utf8");
  return JSON.parse(data);
};

export const writeData = async (data) => {
  await writeFile("events.json", JSON.stringify(data));
};
