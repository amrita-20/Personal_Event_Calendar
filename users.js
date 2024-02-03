const users = {};

const usernamePattern = /^[a-zA-Z0-9]+$/;
const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

const validateUsername = (username) => {
  if (!username) {
    return "required-username";
  }
  if (username.toLowerCase() === "dog") {
    return "auth-insufficient";
  }
  if (!username.match(usernamePattern)) {
    return "invalid-username";
  }
  return "";
};

const addUserEvent = (username, events) => {
  users[username] = events;
};

const getUserEvents = (username) => {
  return users[username];
};

const isValidDateFormat = (dateString) => {
  return dateRegex.test(dateString);
};

module.exports = {
  validateUsername,
  getUserEvents,
  addUserEvent,
  isValidDateFormat,
};
