function calculateAveragePoints(entry) {
  return entry.clicks > 0
    ? Number((entry.totalPoints / entry.clicks).toFixed(2))
    : 0;
}

export default calculateAveragePoints;
