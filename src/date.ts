export function formatDateShort(date: Date) {
  return date
    .toLocaleDateString('ru-RU')
    .replace(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/, '$3-$2-$1');
}

export function dateWithOffset(offsetDays: number, startDate = new Date()) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + offsetDays);
  return date;
}

export function formatDateLong(date: Date) {
  return (
    date
      .toLocaleDateString('ru-RU', {
        dateStyle: 'long',
      })
      .slice(0, -3) +
    ', ' +
    date.toLocaleDateString('ru-RU', {
      weekday: 'long',
    })
  );
}
