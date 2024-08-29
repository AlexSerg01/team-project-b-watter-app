import createHttpError from 'http-errors';

import * as WaterService from '../services/water.js';

export const getWaterConsumptionByMonth = async (req, res, next) => {
  const { month, year } = req.params;
  const userId = req.user._id;
  const dailyNorm = req.user.dailyWaterIntake;

  const result = await WaterService.getWaterConsumption(
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

// -------------------------------------------------------

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
