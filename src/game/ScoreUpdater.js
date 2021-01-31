import Button from "../common/Button";
import classes from "./ScoreUpdater.module.css";

const MAX_CLICKS = 10;

function ScoreUpdater({ score, onUpdateScore, clickCount }) {
  return (
    <section data-testid="ScoreUpdater" className={classes.root}>
      <div>
        <div className={classes.score}>{score}</div>
        <div className={classes.buttonWrapper}>
          <Button
            className={classes.button}
            onClick={onUpdateScore}
            text="UPDATE SCORE"
            disabled={clickCount >= MAX_CLICKS}
          />
        </div>
        <span className={classes.clickCount}>
          {clickCount >= 10
            ? "You have reached the maximum number of clicks! Please save your score or refresh the page to reset."
            : `${MAX_CLICKS - clickCount} clicks remaining`}
        </span>
      </div>
    </section>
  );
}

export default ScoreUpdater;
