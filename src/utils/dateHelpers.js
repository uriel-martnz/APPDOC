import { format, parseISO, isToday, isTomorrow, isPast, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return format(date, 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return format(date, "dd/MM/yyyy 'a las' HH:mm", { locale: es });
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = parseISO(dateString);

  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Mañana';

  return format(date, 'EEEE, dd MMMM', { locale: es });
};

export const isAppointmentPast = (dateString) => {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return isPast(date);
};

export const isAppointmentFuture = (dateString) => {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return isFuture(date);
};

export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDatePlusDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const formatDateISO = (date) => {
  if (!date) return '';
  if (typeof date === 'string') return date.split('T')[0];
  return date.toISOString().split('T')[0];
};
