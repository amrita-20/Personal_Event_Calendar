const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;
const pattern = /^\/api\/auth\/.*$/;

const sessions = require("./sessions");
const users = require("./users");
const events = require("./events");

app.use(cookieParser());
app.use(express.json());
app.use(express.static("./dist"));

// Middleware for pre-filtering requests based on authorization
// Checks if a valid session ID (sid) cookie is present in the request
// If the session is not valid, responds with a 401 Unauthorized status and an "auth-missing" error
// If the session is valid, proceeds to the next middleware in the stack
app.use(pattern, (req, res, next) => {
  const sid = req.cookies.sid;
  if (!sessions.isValidSession(sid)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  next();
});

app.get("/api/auth/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sessions.getSessionUser(sid);
  res.json({ username });
});

app.post("/api/v1/session", (req, res) => {
  const { username, startDate, endDate } = req.body;
  const errorCode = users.validateUsername(username);
  if (errorCode) {
    res.status(400).json({ error: errorCode });
    return;
  }

  if (
    !users.isValidDateFormat(startDate) ||
    !users.isValidDateFormat(endDate)
  ) {
    res.status(400).json({ error: "invalid-date-format" });
    return;
  }

  const sid = sessions.addSession(username);
  const existingUserData = users.getUserEvents(username);

  if (!existingUserData) {
    users.addUserEvent(username, events.makeEventList());
  }

  res.cookie("sid", sid);
  res.json(users.getUserEvents(username).getEvents(startDate, endDate));
});

app.delete("/api/auth/v1/session", (req, res) => {
  const sid = req.cookies.sid;
  if (sid) {
    res.clearCookie("sid");
  }
  sessions.deleteSession(sid);
  res.json({ message: "user is logged out" });
});

app.get("/api/auth/v1/user/event", (req, res) => {
  const sid = req.cookies.sid;

  const username = sessions.getSessionUser(sid);
  const { startDate, endDate } = req.query;

  res.json(users.getUserEvents(username).getEvents(startDate, endDate));
});

app.post("/api/auth/v1/user/event", (req, res) => {
  const sid = req.cookies.sid;

  const { title, eventDate } = req.body;
  const startDate = eventDate;
  const endDate = eventDate;
  if (!title) {
    res.status(400).json({ error: "required-title" });
    return;
  }
  if (title.length > 50) {
    res.status(400).json({ error: "exceed-character" });
    return;
  }
  const username = sessions.getSessionUser(sid);
  const eventList = users.getUserEvents(username);
  if (eventList.getEvents(startDate, endDate).length >= 5) {
    res.status(400).json({ error: "max-events" });
    return;
  }
  const id = eventList.addEvent(req.body);
  res.json(eventList.getEvent(id));
});

app.put("/api/auth/v1/user/event/:id", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  const eventList = users.getUserEvents(username);
  const { id } = req.params;
  const { title, description, eventDate } = req.body;
  if (!title) {
    res.status(400).json({ error: "required-title" });
    return;
  }
  if (title.length > 40) {
    res.status(400).json({ error: "exceed-character" });
    return;
  }
  if (!eventList.contains(id)) {
    res
      .status(404)
      .json({ error: `noSuchId`, message: `No event with id ${id}` });
    return;
  }
  eventList.updateEvent(id, { title, description, eventDate });
  res.json(eventList.getEvent(id));
});

app.delete("/api/auth/v1/user/event/:id", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";

  const { id } = req.params;
  const eventList = users.getUserEvents(username);
  const exists = eventList.contains(id);
  if (exists) {
    eventList.deleteEvent(id);
  }
  res.json({
    message: exists ? `event ${id} deleted` : `event ${id} did not exist`,
  });
});

app.listen(PORT, () => console.log("server running"));
