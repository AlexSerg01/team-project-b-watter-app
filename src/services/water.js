import WaterConsumptionCollection from '../bd/models/water.js';
import { getUser } from './user.js';

export const addWaterConsumption = async (record) => {
  return WaterConsumptionCollection.create(record);
};

// -------------------------------------------------------

export const updateWaterConsumption = (id, userId, payload) => {
  return WaterConsumptionCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
    },
  );
};

// -------------------------------------------------------

export const deleteWaterConsumption = (id, userId) => {
  return WaterConsumptionCollection.findOneAndDelete({
    _id: id,
    userId,
  });
};

// -------------------------------------------------------

export const getUserDailyWaterConsumption = async (userId) => {
  const user = await getUser(userId);
  const dailyNorm = user[0].dailyWaterIntake || 2000;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const dailyRecords = await WaterConsumptionCollection.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  const totalConsumed = dailyRecords.reduce(
    (total, record) => total + record.amount,
    0,
  );
  const percentageOfNorm = (totalConsumed / dailyNorm) * 100;

  return { percentageOfNorm, dailyRecords };
};

// -------------------------------------------------------

export const getWaterConsumptionByMonth = async (
  userId,
  dailyNorm,
  month,
  year,
) => {
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const waterData = await WaterConsumptionCollection.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const dailyData = {};
  for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(
      day,
    ).padStart(2, '0')}`;
    dailyData[dateKey] = { totalAmount: 0, entries: 0 };
  }

  waterData.forEach((record) => {
    const date = new Date(record.date);
    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (dailyData[dateKey]) {
      dailyData[dateKey].totalAmount += record.amount;
      dailyData[dateKey].entries += 1;
    }
  });

  const result = Object.keys(dailyData).map((dateKey) => {
    const [year, month, day] = dateKey.split('-');
    const date = new Date(year, month - 1, day);
    const monthName = date.toLocaleString('en-US', { month: 'long' });

    const totalAmount = dailyData[dateKey].totalAmount;
    const percentageConsumed =
      dailyNorm > 0 ? Math.round((totalAmount / dailyNorm) * 100) : 0;

    return {
      date: `${String(day).padStart(2, '0')}, ${monthName}`,
      dailyNorm: `${(dailyNorm / 1000).toFixed(1)} l`,
      percentageConsumed: `${percentageConsumed}%`,
      entries: dailyData[dateKey].entries,
    };
  });

  return result;
};
