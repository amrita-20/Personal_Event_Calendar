import { useState } from "react";

function Dropdown() {
  const [viewType, setViewType] = useState("Month");
  const options = ["Month", "Week", "Day"];

  const optionsList = options.map((option) => {
    return <option key={option} value={option}>{option}</option>;
  });

  return (
    <select
      className="dropdown view-type"
      aria-label="calendar view type"
      name="view-type"
      id="view-type"
      disabled
      value={viewType}
      onChange={(e) => setViewType(e.target.value)}
    >
      {optionsList}
    </select>
  );
}
export default Dropdown;
