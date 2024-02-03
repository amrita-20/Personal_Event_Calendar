const { parse } = require("date-fns");
const uuid = require("uuid").v4;

function makeEventList() {
  const eventList = {};

  const events = {};

  eventList.addEvent = (eventDetails) => {
    const { title, description, eventDate } = eventDetails;
    const id = uuid();
    events[id] = {
      id,
      title,
      description,
      eventDate,
    };
    return id;
  };

  eventList.getEvent = (id) => {
    return events[id];
  };

  eventList.getEvents = (startDate, endDate) => {
    const newStartDate = parse(startDate, "dd-MM-yyyy", new Date());
    const newEndDate = parse(endDate, "dd-MM-yyyy", new Date());

    const filteredEvents = Object.values(events).filter((eventData) => {
      const eventDate = parse(eventData.eventDate, "dd-MM-yyyy", new Date());
      return eventDate >= newStartDate && eventDate <= newEndDate;
    });
    return filteredEvents;
  };

  eventList.contains = function contains(id) {
    return !!events[id];
  };

  eventList.deleteEvent = (id) => {
    delete events[id];
  };

  eventList.updateEvent = (id, event) => {
    events[id].title = event.title || events[id].title;
    events[id].description = event.description || events[id].description;
    events[id].eventDate = event.eventDate;
  };

  return eventList;
}

module.exports = {
  makeEventList,
};
