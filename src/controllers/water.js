import * as WaterService from '../services/water.js';

export const getWaterConsumptionByMonth = async (req, res) => {
  const { month, year } = req.params;
  const userId = req.user._id;

  const result = await WaterService.getWaterConsumption(userId, month, year);

  res.status(200).json({
    status: 200,
    message: `Month period records of water consumption per day for userId: ${userId}`,
    data: result,
  });
};

export const addWaterConsumption = async (req, res) => {
  const waterConsumption = {
    userId: req.user._id,
    date: new Date().toISOString(),
    amount: req.body.amount,
  };

  const newRecord = await WaterService.addWaterConsumption(waterConsumption);

  res.status(201).json({
    status: 201,
    message: 'Successfully add new water consumption record',
    data: newRecord,
  });
};
