import { useEffect, useRef, useState } from "react";
import {
  format,
  parse,
  startOfWeek,
  addDays,
  startOfMonth,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
  endOfMonth,
  endOfWeek,
  isSameYear,
} from "date-fns";
import Button from "./Button";
import "./Calendar.css";
import EventDetailsModal from "./EventDetailsModal";
import Spinner from "./Spinner";
import Dropdown from "./Dropdown";
import { DATE_FORMATS } from "./constants";

function Calendar({
  username,
  onSave,
  events,
  onDelete,
  onEdit,
  getEvents,
  isEventPending,
  isAddEventPending,
  modalError,
  setModalError,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const eventDetailsDialogRef = useRef();
  const startDateOfMonth = format(
    startOfMonth(currentDate),
    DATE_FORMATS.SERVER_DATE
  );
  const endDateOfMonth = format(
    endOfMonth(currentDate),
    DATE_FORMATS.SERVER_DATE
  );

  useEffect(() => {
    getEvents(startDateOfMonth, endDateOfMonth);
  }, [currentDate]);

  const openDialog = (e, date) => {
    e.preventDefault();
    setSelectedDate(date);
    eventDetailsDialogRef.current.showModal();
  };

  const setToday = (e) => {
    e.preventDefault();
    setSelectedDate(new Date());
    setCurrentDate(new Date());
  };

  const getTitle = () => {
    return (
      <div className="calendar__title">
        <Button type="button" className="today-button" onClick={setToday}>
          Today
        </Button>
        <Button
          type="link"
          visual="link"
          className="left-icon"
          aria-label="previous"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          {"<"}
        </Button>
        <Button
          type="link"
          visual="link"
          className="right-icon"
          aria-label="next"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          {">"}
        </Button>
        <h2 className="current-month">{format(currentDate, "MMMM yyyy")}</h2>
      </div>
    );
  };

  const getWeekDays = () => {
    const weekDays = [];
    const startDate = startOfWeek(currentDate);

    for (let day = 1; day <= 7; day++) {
      weekDays.push(
        <div key={`day-${day}`} className="week-name">
          {format(addDays(startDate, day), "E")}
        </div>
      );
    }
    return <div className="days calendar__week border">{weekDays}</div>;
  };

  const getDates = () => {
    const startDateOfMonth = startOfMonth(currentDate);
    const endDateOfMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(startDateOfMonth);
    const endDate = endOfWeek(endDateOfMonth);

    let activeDate = startDate;

    const weeks = [];
    let weekIndex = 0;

    while (activeDate < endDate) {
      weeks.push(
        <div key={`week-${weekIndex}`} className="weeks calendar__week">
          {generateDatesForCurrentWeek(activeDate, selectedDate, currentDate)}
        </div>
      );
      activeDate = addDays(activeDate, 7);
      weekIndex++;
    }

    return <>{weeks}</>;
  };
  const checkIfHasEvent = (dateCopy) => {
    return (
      events &&
      events.some((eventData) => {
        const newDate = parse(
          eventData.eventDate,
          DATE_FORMATS.SERVER_DATE,
          new Date()
        );
        return (
          isSameYear(newDate, dateCopy) &&
          isSameMonth(newDate, dateCopy) &&
          isSameDay(newDate, dateCopy)
        );
      })
    );
  };

  const generateDatesForCurrentWeek = (date, selectedDate, currentDate) => {
    let activeDate = date;
    const week = [];
    for (let day = 1; day <= 7; day++) {
      const dateCopy = activeDate;
      const hasEvent = checkIfHasEvent(dateCopy);
      const cardColorClass = hasEvent ? "card-color" : "";
      const key = `${format(activeDate, "d")}-${day}`;
      week.push(
        <div
          key={key}
          className={`day-wrapper ${cardColorClass}`}
          onClick={(e) => openDialog(e, dateCopy)}
        >
          <div
            aria-label="select date"
            className={`day ${
              isSameMonth(activeDate, currentDate) ? "" : "disabled-day"
            } ${isSameDay(activeDate, selectedDate) ? "selected-day" : ""}
              ${isSameDay(activeDate, new Date()) ? "today" : ""}`}
          >
            {format(activeDate, "d")}
          </div>
          {hasEvent && <div className="event-indicator">Events</div>}
        </div>
      );
      activeDate = addDays(activeDate, 1);
    }
    return <>{week}</>;
  };

  return (
    <div className="calendar">
      {isEventPending && <Spinner />}
      <h2 className="calendar__header text-center capitalize">
        Welcome {username}! Lets Plan Your Events With EventHub
      </h2>
      <div className="calendar__top">
        {getTitle()}
        <Dropdown />
      </div>
      {getWeekDays()}
      {getDates()}

      <EventDetailsModal
        dialogRef={eventDetailsDialogRef}
        eventList={events}
        selectedDate={selectedDate}
        onDelete={onDelete}
        startDateOfMonth={startDateOfMonth}
        endDateOfMonth={endDateOfMonth}
        onSave={onSave}
        onEdit={onEdit}
        isAddEventPending={isAddEventPending}
        modalError={modalError}
        setModalError={setModalError}
      />
    </div>
  );
}

export default Calendar;
