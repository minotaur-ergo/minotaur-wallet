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

export const toDay = (ts: number) => {
  const d = new Date(ts);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
