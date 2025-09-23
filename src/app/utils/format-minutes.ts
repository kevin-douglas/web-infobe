export const formatMinutes = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} minutos`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours} horas ${remainingMinutes} minutos`
    : `${hours} hora`;
};
