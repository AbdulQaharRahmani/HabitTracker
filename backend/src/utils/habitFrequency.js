import dayjs from 'dayjs';

export const isHabitForSelectedDay = (habit, selectedDate) => {
  if (!habit || !selectedDate) return false;

  const selected = selectedDate.startOf('day');
  const habitStart = dayjs(habit.createdAt).startOf('day');

  if (selected.isBefore(habitStart, 'day')) return false;

  const selectedDay = selected.day(); //exp: 0 = Sunday, 1 = monday

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
      const daysSinceStart = selected.diff(habitStart, 'day');
      return daysSinceStart % 2 === 0;
    }

    case 'biweekly': {
      const weeksSinceStart = Math.floor(selected.diff(habitStart, 'day') / 7);
      return selectedDay === habitStart.day() && weeksSinceStart % 2 === 0;
    }

    default:
      return false;
  }
};
