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
