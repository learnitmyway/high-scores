const MAX_CLICKS = 10;

function ScoreUpdater({ score, onUpdateScore, clickCount }) {
  return (
    <section>
      <div>score {score}</div>
      <div>
        <button
          type="button"
          onClick={onUpdateScore}
          disabled={clickCount >= MAX_CLICKS}
        >
          generate score
        </button>
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
