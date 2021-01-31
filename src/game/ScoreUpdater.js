import Button from "../common/Button";
import classes from "./ScoreUpdater.module.css";

const MAX_CLICKS = 10;

function ScoreUpdater({ score, onUpdateScore, clickCount }) {
  return (
    <section>
      <div>score {score}</div>
      <div>
        <Button
          className={classes.button}
          onClick={onUpdateScore}
          text="UPDATE SCORE"
          disabled={clickCount >= MAX_CLICKS}
        />
        <span>
          {clickCount >= 10
            ? "You have reached the maximum number of clicks! Please send your score or refresh the page."
            : `${MAX_CLICKS - clickCount} clicks remaining`}
        </span>
      </div>
    </section>
  );
}

export default ScoreUpdater;
