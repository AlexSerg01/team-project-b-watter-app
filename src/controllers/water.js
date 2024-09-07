import createHttpError from 'http-errors';
import * as WaterService from '../services/water.js';
import { calculateWaterConsumptionStats } from '../utils/waterUtils.js';

export const addWaterConsumption = async (req, res) => {
  const userId = req.user._id;
  const dailyNorm = req.user.dailyWaterIntake || 2000;

  const { dailyRecords } = await WaterService.getUserDailyWaterConsumption(
    userId,
  );

  const { consumedWaterByDay, percentageConsumed } =
    calculateWaterConsumptionStats(
      [...dailyRecords, { amount: req.body.amount }],
      dailyNorm,
    );

  const waterConsumption = {
    userId,
    date: new Date(),
    amount: parseInt(req.body.amount),
    dailyNorm,
    percentageConsumed,
    consumedWaterByDay,
  };

  const newRecord = await WaterService.addWaterConsumption(waterConsumption);

  const formattedDate = `${String(new Date().getDate()).padStart(
    2,
    '0',
  )}, ${new Date().toLocaleString('en-US', { month: 'long' })}`;

  const responseDailyNorm = (dailyNorm / 1000).toFixed(1);
  const responseConsumedWaterByDay = (consumedWaterByDay / 1000).toFixed(1);

  res.status(201).json({
    status: 201,
    message: 'New water consumption record has been added successfully!',
    data: {
      ...newRecord.toObject(),
      date: formattedDate,
      dailyNorm: `${responseDailyNorm} l`,
      percentageConsumed: `${percentageConsumed}%`,
      consumedWaterByDay: `${responseConsumedWaterByDay} l`,
    },
  });
};

//-----------------------------------------------------------------

export const updateWaterConsumption = async (req, res, next) => {
  const userId = req.user._id;
  const dailyNorm = req.user.dailyWaterIntake || 2000;
  const { id } = req.params;

  const waterConsumption = {
    date: new Date(),
    amount: parseInt(req.body.amount),
  };

  const updatedRecord = await WaterService.updateWaterConsumption(
    id,
    userId,
    waterConsumption,
  );

  if (!updatedRecord || updatedRecord.userId.toString() !== userId.toString()) {
    return next(createHttpError(404, 'Record not found'));
  }

  const { dailyRecords } = await WaterService.getUserDailyWaterConsumption(
    userId,
  );

  const { consumedWaterByDay, percentageConsumed } =
    calculateWaterConsumptionStats(dailyRecords, dailyNorm);

  updatedRecord.percentageConsumed = percentageConsumed;
  updatedRecord.consumedWaterByDay = consumedWaterByDay;
  await updatedRecord.save();

  const formattedDate = `${String(new Date().getDate()).padStart(
    2,
    '0',
  )}, ${new Date().toLocaleString('en-US', { month: 'long' })}`;

  const responseDailyNorm = (dailyNorm / 1000).toFixed(1);
  const responseConsumedWaterByDay = (consumedWaterByDay / 1000).toFixed(1);

  res.status(200).json({
    status: 200,
    message: 'Water consumption record has been updated successfully!',
    data: {
      ...updatedRecord.toObject(),
      date: formattedDate,
      dailyNorm: `${responseDailyNorm} l`,
      percentageConsumed: `${percentageConsumed}%`,
      consumedWaterByDay: `${responseConsumedWaterByDay} l`,
    },
  });
};

//-----------------------------------------------------------------

export const deleteWaterConsumption = async (req, res, next) => {
  const { id } = req.params;

  const result = await WaterService.deleteWaterConsumption(id, req.user._id);

  if (result === null || result.userId.toString() !== req.user._id.toString()) {
    return next(createHttpError(404, 'Record not found'));
  }

  res.status(204).end();
};

//-----------------------------------------------------------------

export const getDailyWaterConsumption = async (req, res) => {
  const userId = req.user._id;

  const { percentageOfNorm, dailyRecords } =
    await WaterService.getUserDailyWaterConsumption(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved daily water consumption data',
    data: {
      percentageOfNorm,
      dailyRecords,
    },
  });
};

//-----------------------------------------------------------------

export const getWaterConsumptionByMonth = async (req, res) => {
  const { month, year } = req.params;
  const monthInt = parseInt(month);
  const yearInt = parseInt(year);

  if (
    isNaN(monthInt) ||
    isNaN(yearInt) ||
    monthInt < 1 ||
    monthInt > 12 ||
    yearInt < 1970
  ) {
    throw createHttpError(400, 'Invalid month or year provided');
  }

  const fullMonthData = await WaterService.getWaterConsumptionByMonth(
    req.user._id,
    monthInt,
    yearInt,
    req.user.dailyWaterIntake || 2000,
  );

  res.status(200).json({
    status: 200,
    data: fullMonthData,
  });
};
