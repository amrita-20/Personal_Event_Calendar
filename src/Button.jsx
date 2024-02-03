function Button({
  type = "button",
  visual = "button",
  children,
  className,
  onClick,
}) {
  let btnClass = "button";
  if (visual === "link") {
    btnClass = "button-link";
  }
  return (
    <button
      className={`${btnClass} ${className}`}
      type={type}
      visual={visual}
      onClick={(e) => onClick(e)}
    >
      {children}
    </button>
  );
}

export default Button;
