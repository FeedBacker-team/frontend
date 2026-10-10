import { differenceInCalendarDays } from 'date-fns';

function getQaDaysRemaining(endAt: string, today = new Date()) {
  return Math.max(0, differenceInCalendarDays(new Date(endAt), today));
}

function formatQaDeadlineLabel(daysRemaining: number) {
  return daysRemaining === 0 ? 'D-Day' : `D-${daysRemaining}`;
}

export { formatQaDeadlineLabel, getQaDaysRemaining };
