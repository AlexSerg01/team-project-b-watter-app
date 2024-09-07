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
  record,
  dailyNorm,
  consumedWaterByDay,
  percentageConsumed,
  entries,
) => {
  return {
    _id: record._id,
    date: record.date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'long',
    }),
    amount: `${record.amount} ml`,
    dailyNorm: `${(dailyNorm / 1000).toFixed(1)} l`,
    consumedWaterByDay: `${(consumedWaterByDay / 1000).toFixed(1)} l`,
    percentageConsumed: `${percentageConsumed.toFixed(1)} %`,
    entries,
  };
};
