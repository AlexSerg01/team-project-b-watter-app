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
  amount,
  day,
  month,
  year,
  dailyNorm,
  consumedWaterByDay,
  percentageConsumed,
  entries,
) => {
  const formattedDate = `${String(day).padStart(2, '0')}, ${new Date(
    year,
    month - 1,
    day,
  ).toLocaleString('en-US', { month: 'long' })}`;
  const responseDailyNorm = (dailyNorm / 1000).toFixed(1);
  const responseConsumedWaterByDay = (consumedWaterByDay / 1000).toFixed(1);

  return {
    id,
    userId,
    amount,
    date: formattedDate,
    dailyNorm: `${responseDailyNorm} L`,
    percentageConsumed: `${percentageConsumed}%`,
    consumedWaterByDay: `${responseConsumedWaterByDay} L`,
    entries,
  };
};
