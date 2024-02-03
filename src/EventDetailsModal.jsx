import { useState } from "react";
import "./EventDetailsModal.css";
import { format } from "date-fns";
import EventList from "./EventList";
import Spinner from "./Spinner";
import Status from "./Status";
import { DATE_FORMATS } from "./constants";
import EventForm from "./EventForm";

function EventDetailsModal({
  dialogRef,
  eventList,
  selectedDate,
  onDelete,
  onSave,
  onEdit,
  startDateOfMonth,
  endDateOfMonth,
  isAddEventPending,
  modalError,
  setModalError,
}) {
  const [toggleUpdate, setToggleUpdate] = useState("hide");
  const [toggleSave, setToggleSave] = useState("");
  const [id, setId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formattedDate = format(selectedDate, DATE_FORMATS.CLIENT_DATE);
  const eventDate = format(selectedDate, DATE_FORMATS.SERVER_DATE);

  const scrollToTop = () => {
    if (dialogRef.current) {
      dialogRef.current.scrollTop = 0;
    }
  };

  const handleCancel = () => {
    setToggleUpdate("hide");
    setToggleSave("");
    setModalError("");
    setSelectedEvent(null);
    dialogRef.current.close();
  };

  const editEvent = (evenData) => {
    setSelectedEvent(evenData);
    setId(evenData.id);
    setToggleUpdate("");
    setToggleSave("hide");
  };

  const updateEvent = (title, description) => {
    const eventDetails = { title, description, eventDate };
    setToggleUpdate("hide");
    setToggleSave("");
    onEdit(id, eventDetails);
    scrollToTop();
  };

  const addEvent = (title, description) => {
    const eventDetails = { title, description, eventDate };
    onSave(eventDetails);
    scrollToTop();
  };

  return (
    <dialog className="modal" ref={dialogRef}>
      {isAddEventPending && <Spinner />}
      {modalError && <Status error={modalError} />}
      {eventList?.length > 0 ? (
        <EventList
          selectedDate={selectedDate}
          eventList={eventList}
          onDelete={onDelete}
          startDateOfMonth={startDateOfMonth}
          endDateOfMonth={endDateOfMonth}
          onEdit={editEvent}
        ></EventList>
      ) : (
        <div className="text-center">
          No events for the day, let's add events
        </div>
      )}
      <EventForm
        onAdd={addEvent}
        onUpdate={updateEvent}
        onCancle={handleCancel}
        toggleSave={toggleSave}
        toggleUpdate={toggleUpdate}
        formattedDate={formattedDate}
        selectedEvent={selectedEvent}
      />
    </dialog>
  );
}

export default EventDetailsModal;
