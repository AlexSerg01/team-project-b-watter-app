import { WaterConsumptionCollection } from '../bd/models/water.js';
import { getUser } from './user.js';
import { calculateWaterConsumptionStats } from '../utils/waterUtils.js';

export const addWaterConsumption = async (record) => {
  return WaterConsumptionCollection.create(record);
};

//-----------------------------------------------------------------

export const updateWaterConsumption = (id, userId, payload) => {
  return WaterConsumptionCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
    },
  );
};

//-----------------------------------------------------------------

export const deleteWaterConsumption = async (id, userId) => {
  const deletedRecord = await WaterConsumptionCollection.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!deletedRecord) {
    return null;
  }

  const { dailyRecords } = await getUserDailyWaterConsumption(userId);
  const dailyNorm = deletedRecord.dailyNorm || 2000;

  const { consumedWaterByDay, percentageConsumed } =
    calculateWaterConsumptionStats(dailyRecords, dailyNorm);

  return {
    deletedRecord,
    dailyNorm,
    consumedWaterByDay,
    percentageConsumed,
  };
};

//-----------------------------------------------------------------

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

//-----------------------------------------------------------------

export const getWaterConsumptionByMonth = async (
  userId,
  month,
  year,
  dailyNorm,
) => {
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const records = await WaterConsumptionCollection.find({
    userId,
    date: { $gte: startDate, $lt: endDate },
  }).sort({ date: 1 });

  const daysInMonth = new Date(year, month, 0).getDate();
  const fullMonthData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getDate() === day;
    });
    const genPercent = dayRecords.reduce((acc, curr) => {
      const percent = Number(curr.percentageConsumed);
      return acc + (isNaN(percent) ? 0 : percent);
    }, 0);

    let consumedWaterByDay = 0;
    // let percentageConsumed = 0;

    if (dayRecords.length > 0) {
      const stats = calculateWaterConsumptionStats(dayRecords, dailyNorm);
      consumedWaterByDay = stats.consumedWaterByDay;
      // percentageConsumed = stats.percentageConsumed;
    }

    // const responseDailyNorm = (dailyNorm / 1000).toFixed(1);
    const responseConsumedWaterByDay = (consumedWaterByDay / 1000).toFixed(1);
    const responseDailyNorm = dayRecords[0]?.dailyNorm ? (dayRecords[0].dailyNorm / 1000).toFixed(1) : 2

    fullMonthData.push({
      date: `${String(day).padStart(2, '0')}, ${new Date(
        year,
        month - 1,
        day,
      ).toLocaleString('en-US', { month: 'long' })}`,
      dailyNorm: `${responseDailyNorm} L`,
      // percentageConsumed: `${percentageConsumed}%`,
      percentageConsumed: `${Math.round(genPercent)}%`,
      entries: dayRecords.length,
      consumedWaterByDay: `${responseConsumedWaterByDay} L`,
    });
  }

  return fullMonthData;
};
