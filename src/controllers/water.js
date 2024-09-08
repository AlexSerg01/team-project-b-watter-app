import createHttpError from 'http-errors';
import * as WaterService from '../services/water.js';
import {
  calculateWaterConsumptionStats,
  formatWaterResponse,
} from '../utils/waterUtils.js';

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
  const updatedDailyRecords = await WaterService.getUserDailyWaterConsumption(
    userId,
  );
  const entries = updatedDailyRecords.dailyRecords.length;

  const date = new Date();
  const response = formatWaterResponse(
    newRecord._id,
    userId,
    newRecord.amount,
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    dailyNorm,
    consumedWaterByDay,
    percentageConsumed,
    entries,
    newRecord.createdAt,
    newRecord.updatedAt,
  );

  res.status(201).json({
    status: 201,
    message: 'New water consumption record has been added successfully!',
    data: response,
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

  const entries = dailyRecords.length;
  const date = new Date(updatedRecord.date);
  const response = formatWaterResponse(
    updatedRecord._id,
    userId,
    updatedRecord.amount,
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    dailyNorm,
    consumedWaterByDay,
    percentageConsumed,
    entries,
    updatedRecord.createdAt,
    updatedRecord.updatedAt,
  );

  res.status(200).json({
    status: 200,
    message: 'Water consumption record has been updated successfully!',
    data: response,
  });
};

//-----------------------------------------------------------------

export const deleteWaterConsumption = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  const result = await WaterService.deleteWaterConsumption(id, userId);

  if (!result) {
    return next(createHttpError(404, 'Record not found'));
  }

  const { deletedRecord, dailyNorm, consumedWaterByDay, percentageConsumed } =
    result;
  const { dailyRecords } = await WaterService.getUserDailyWaterConsumption(
    userId,
  );
  const entries = dailyRecords.length;

  const date = new Date(deletedRecord.date);
  const response = formatWaterResponse(
    deletedRecord._id,
    userId,
    deletedRecord.amount,
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    dailyNorm,
    consumedWaterByDay,
    percentageConsumed,
    entries,
    deletedRecord.createdAt,
    deletedRecord.updatedAt,
  );

  res.status(200).json({
    status: 200,
    message: 'Water consumption record has been deleted successfully!',
    data: response,
  });
};

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
