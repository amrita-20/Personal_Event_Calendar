import { parse, isSameMonth, isSameDay, isSameYear } from "date-fns";
import Button from "./Button";
import deleteSvg from "./assets/delete.svg";
import editSvg from "./assets/edit.svg";
import { DATE_FORMATS } from "./constants";

function EventList({
  selectedDate,
  eventList,
  onDelete,
  onEdit,
  startDateOfMonth,
  endDateOfMonth,
}) {
  let filteredEvents = eventList.filter((eventData) => {
    const newDate = parse(
      eventData.eventDate,
      DATE_FORMATS.SERVER_DATE,
      new Date()
    );
    return (
      isSameYear(newDate, selectedDate) &&
      isSameMonth(newDate, selectedDate) &&
      isSameDay(newDate, selectedDate)
    );
  });

  const deleteEvent = (id) => {
    onDelete(id, startDateOfMonth, endDateOfMonth);
  };

  const editEvent = (evenData) => {
    onEdit(evenData);
  };
  return (
    <div>
      <ul className="event__list">
        <h2 className="event__header text-center">Event List</h2>
        {filteredEvents.map((eventData) => (
          <li className="event__item" key={eventData.id}>
            <p className="event__title">{eventData.title}</p>
            <div className="btn-container">
              <Button
                className="delete-btn"
                type="button"
                aria-label="delete"
                onClick={() => deleteEvent(eventData.id)}
              >
                <img src={deleteSvg} alt="icon of delete" />
              </Button>
              <Button
                className="edit-btn"
                type="button"
                aria-label="edit"
                onClick={() => editEvent(eventData)}
              >
                <img src={editSvg} alt="icon of edit" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;
