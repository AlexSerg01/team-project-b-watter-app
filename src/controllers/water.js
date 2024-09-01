import createHttpError from 'http-errors';

import * as WaterService from '../services/water.js';

export const addWaterConsumption = async (req, res) => {
  const waterConsumption = {
    userId: req.user._id,
    date: new Date().toISOString(),
    amount: parseInt(req.body.amount),
  };

  const newRecord = await WaterService.addWaterConsumption(waterConsumption);

  res.status(201).json({
    status: 201,
    message: 'New water consumption record has been added successfully!',
    data: newRecord,
  });
};

// -------------------------------------------------------

export const updateWaterConsumption = async (req, res, next) => {
  const { id } = req.params;
  const waterConsumption = {
    date: new Date().toISOString(),
    amount: parseInt(req.body.amount),
  };

  const updatedRecord = await WaterService.updateWaterConsumption(
    id,
    req.user._id,
    waterConsumption,
  );

  if (
    updatedRecord === null ||
    updatedRecord.userId.toString() !== req.user._id.toString()
  )
    return next(createHttpError(404, 'Record not found'));

  res.status(200).json({
    status: 200,
    message: 'Water consumption record has been updated successfully!',
    data: updatedRecord,
  });
};

// -------------------------------------------------------

export const deleteWaterConsumption = async (req, res, next) => {
  const { id } = req.params;

  const result = await WaterService.deleteWaterConsumption(id, req.user._id);

  if (result === null || result.userId.toString() !== req.user._id.toString()) {
    return next(createHttpError(404, 'Record not found'));
  }

  res.status(204).end();
};

// -------------------------------------------------------

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

// -------------------------------------------------------

export const getWaterConsumptionByMonth = async (req, res, next) => {
  const { month, year } = req.params;
  const userId = req.user._id;
  const dailyNorm = req.user.dailyWaterIntake;

  const result = await WaterService.getWaterConsumptionByMonth(
    userId,
    dailyNorm,
    month,
    year,
  );

  if (result === null) {
    return next(createHttpError(404, 'Records not found'));
  }

  res.status(200).json({
    status: 200,
    message: `Month period records of water consumption per day for userId: ${userId}`,
    data: result,
  });
};
