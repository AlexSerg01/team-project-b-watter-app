export const calculateWaterConsumptionStats = (dailyRecords, dailyNorm) => {
  const consumedWaterByDay = dailyRecords.reduce(
    (total, record) => total + parseInt(record.amount),
    0,
  );
  const percentageConsumed = (consumedWaterByDay / dailyNorm) * 100;

  return {
    consumedWaterByDay,
    percentageConsumed: Math.round(percentageConsumed),
  };
};

//-----------------------------------------------------------------

export const formatWaterResponse = (
  id,
  userId,
  day,
  month,
  year,
  time,
  amount,
  dailyNorm,
  consumedWaterByDay,
  percentageConsumed,
  entries,
  createdAt,
  updatedAt,
) => {
  const formattedDate = `${String(day).padStart(2, '0')}, ${new Date(
    year,
    month - 1,
    day,
  ).toLocaleString('en-US', { month: 'long' })}`;

  const [hours, minutes] = time.split(':');
  const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

  const responseDailyNorm = (dailyNorm / 1000).toFixed(1);
  const responseConsumedWaterByDay = (consumedWaterByDay / 1000).toFixed(1);

  return {
    id,
    userId,
    date: formattedDate,
    time: formattedTime,
    amount,
    dailyNorm: `${responseDailyNorm} L`,
    percentageConsumed: `${percentageConsumed}%`,
    consumedWaterByDay: `${responseConsumedWaterByDay} L`,
    entries,
    createdAt,
    updatedAt,
  };
};
