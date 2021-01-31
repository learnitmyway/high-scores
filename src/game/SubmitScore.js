import Button from "../common/Button";
import classes from "./SubmitScore.module.css";

function SubmitScore({ name, onChange, onSubmit, isSubmitError }) {
  return (
    <section className={classes.root}>
      <div>
        <label className={classes.label} htmlFor="submit-score-input">
          Name
        </label>
        <input
          id="submit-score-input"
          className={classes.input}
          value={name}
          onChange={onChange}
          placeholder="NAME"
        />
        <Button className={classes.button} onClick={onSubmit} text="Save" />
        <span style={{ color: "red" }}>
          {isSubmitError && " Error: cannot submit score"}
        </span>
      </div>
    </section>
  );
}

export default SubmitScore;
