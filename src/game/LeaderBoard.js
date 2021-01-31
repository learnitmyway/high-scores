function LeaderBoard({ scores }) {
  return scores.map((entry, i) =>
    i < 10 ? (
      <div data-testid="leaderBoardEntry" key={entry.id}>
        <span>{entry.name} </span>
        <span>{entry.totalPoints} </span>
        <span>{entry.clicks} </span>
        <span>{entry.averagePoints} </span>
        <span>{entry.id} </span>
      </div>
    ) : null
  );
}

export default LeaderBoard;
