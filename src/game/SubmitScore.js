import Button from "../common/Button";
import classes from "./SubmitScore.module.css";

function SubmitScore({ name, onChange, onSubmit, isSubmitError }) {
  return (
    <section>
      <label>
        {"Name "}
        <input value={name} onChange={onChange} />
      </label>
      <Button className={classes.button} onClick={onSubmit} text="Send it!" />
      <span style={{ color: "red" }}>
        {isSubmitError && " Error: cannot submit score"}
      </span>
    </section>
  );
}

export default SubmitScore;
