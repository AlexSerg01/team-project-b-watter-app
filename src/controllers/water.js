import waterService from '../services/water.js';

export const getWaterConsumptionByMonth = async (req, res) => {
  const { month, year } = req.params;
  const userId = req.user._id;

  const result = await waterService.getWaterConsumption(userId, month, year);

  res.status(200).json({
    status: 200,
    message: `Info about water consumption per day for month period for userId: ${userId}`,
    data: result,
  });
};
