import WaterConsumptionCollection from '../bd/models/water.js';

export const getWaterConsumption = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const getwaterData = await WaterConsumptionCollection.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const dailyData = {};

  getwaterData.forEach((record) => {
    const day = record.date.getDate();
    const monthName = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(record.date);
    const dayKey = `${day}, ${monthName}`;

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = { totalAmount: 0, entries: 0 };
    }
    dailyData[dayKey].totalAmount += record.amount;
    dailyData[dayKey].entries += 1;
  });

  const dailyNorm = 1800; //CHANGE WHEN WATER RATE ENDPOINT WILL BE READY

  return Object.keys(dailyData).map((day) => ({
    date: day,
    dailyNorm: `${dailyNorm} ml`,
    percentageConsumed: `${Math.round(
      (dailyData[day].totalAmount / dailyNorm) * 100,
    )}%`,
    entries: dailyData[day].entries,
  }));
};

// -------------------------------------------------------

export const addWaterConsumption = async (record) => {
  return WaterConsumptionCollection.create(record);
};
