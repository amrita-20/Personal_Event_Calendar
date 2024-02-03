const uuid = require("uuid").v4;

const sessions = {};

const addSession = (username) => {
  const sid = uuid();
  sessions[sid] = { username };
  return sid;
};

const getSessionUser = (sid) => {
  return sessions[sid]?.username;
};

const isValidSession = (sid) => {
  const username = getSessionUser(sid);
  if (!username) {
    return false;
  }
  return true;
};

const deleteSession = (sid) => {
  delete sessions[sid];
};

module.exports = {
  addSession,
  isValidSession,
  deleteSession,
  getSessionUser,
};
