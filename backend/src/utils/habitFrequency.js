import dayjs from 'dayjs';

export const isHabitForSelectedDay = (habit, selectedDate) => {
  const selectedDay = selectedDate.day(); // 0 = Sunday
  const habitStart = dayjs(habit.createdAt);

  switch (habit.frequency) {
    case 'daily':
      return true;

    case 'weekends':
      return selectedDay === 0 || selectedDay === 6;

    case 'weekdays':
      return selectedDay >= 1 && selectedDay <= 5;

    case 'weekly':
      return selectedDay === habitStart.day();

    case 'every-other-day': {
      const daysSinceStart = selectedDate.diff(habitStart, 'day');
      return daysSinceStart >= 0 && daysSinceStart % 2 === 0;
    }

    case 'biweekly': {
      const weeksSinceStart = Math.floor(
        selectedDate.diff(habitStart, 'day') / 7
      );
      return (
        weeksSinceStart >= 0 &&
        selectedDay === habitStart.day() &&
        weeksSinceStart % 2 === 0
      );
    }

    default:
      return false;
  }
};
