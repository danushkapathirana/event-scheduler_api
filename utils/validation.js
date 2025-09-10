export const isValidText = (value, minimumLength = 1) => {
  return value && value.trim().length >= minimumLength;
};

export const isValidImageUrl = (value) => {
  return value && value.startsWith("http");
};

export const isValidDate = (value) => {
  const date = new Date(value);
  return value && date !== "Invalid Date.";
};
