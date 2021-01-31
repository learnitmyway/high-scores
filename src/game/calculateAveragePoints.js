function calculateAveragePoints({ clicks, totalPoints }) {
  return clicks > 0 ? Number((totalPoints / clicks).toFixed(2)) : 0;
}

export default calculateAveragePoints;
