const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const getLast12MonthNames = () => {
  const result: string[] = [];
  let month = new Date().getMonth();
  for (let i = 0; i < 12; i++) {
    result.unshift(monthNames[month]);
    month = (month + 11) % 12;
  }
  return result;
};

export const getWeeklyDateLabels = (count: number) => {
  const labels: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 3600 * 1000);
    labels.push(
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    );
  }
  return labels;
};
