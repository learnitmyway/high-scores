import classes from "./Button.module.css";

function Button({ className, onClick, disabled, text }) {
  return (
    <button
      className={`${classes.button} ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
