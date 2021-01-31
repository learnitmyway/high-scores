import classes from "./LeaderBoard.module.css";

function LeaderBoard({ scores }) {
  return (
    <div className={classes.root}>
      <table className={classes.table}>
        <thead className={classes.row}>
          <tr className={classes.row}>
            <th>Name</th>
            <th>Total Points</th>
            <th className={classes.hide}>Clicks</th>
            <th className={classes.hide}>Average Points</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, i) =>
            i < 10 ? (
              <tr
                className={classes.row}
                data-testid="leaderBoardEntry"
                key={entry.id}
              >
                <td>{entry.name}</td>
                <td>{entry.totalPoints}</td>
                <td className={classes.hide}>{entry.clicks}</td>
                <td className={classes.hide}>{entry.averagePoints}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoard;
