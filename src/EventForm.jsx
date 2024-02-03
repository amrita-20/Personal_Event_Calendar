import { useEffect, useState } from "react";
import Button from "./Button";
function EventForm({
  onAdd,
  onUpdate,
  onCancle,
  toggleSave,
  toggleUpdate,
  formattedDate,
  selectedEvent,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
    }
  }, [selectedEvent]);

  const handleCancel = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setTitle("");
    setDescription("");
    onCancle();
  };

  const updateEvent = (e) => {
    e.preventDefault();
    if (!isValidForm()) {
      setErrorMsg("Title is required, please add title");
      return;
    }
    onUpdate(title, description);
    setErrorMsg("");
    setTitle("");
    setDescription("");
  };

  const addEvent = (e) => {
    e.preventDefault();
    if (!isValidForm()) {
      return;
    }
    onAdd(title, description);
    setErrorMsg("");
    setTitle("");
    setDescription("");
  };

  const isValidForm = () => {
    if (!title) {
      setErrorMsg("Title is required, please add title");
      return false;
    }
    if (title.length > 40) {
      setErrorMsg("Title can not exceed 40 characters");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  return (
    <form className="form">
      <h2 className="text-center">Add Events</h2>
      {errorMsg && <div className="status">{errorMsg}</div>}
      <div className="form-group">
        <label htmlFor="title" className="label">
          Title * (Mandatory field){" "}
        </label>
        <input
          type="text"
          className="title-input"
          id="title"
          value={title}
          aria-label="Add title"
          placeholder="Add title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="date-container">
        <span className="formatted-date">{formattedDate}</span>
      </div>
      <textarea
        type="text"
        className="text-area"
        value={description}
        placeholder="Add description"
        aria-label="Add description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="button-container">
        <Button
          className="cancel button"
          type="button"
          visual="button"
          onClick={(e) => handleCancel(e)}
        >
          Cancel
        </Button>

        <Button
          className={`save-btn ${toggleSave}`}
          type="button"
          onClick={(e) => addEvent(e)}
        >
          Save
        </Button>
        <Button
          className={`update-btn ${toggleUpdate}`}
          type="button"
          onClick={(e) => updateEvent(e)}
        >
          Update
        </Button>
      </div>
    </form>
  );
}

export default EventForm;
