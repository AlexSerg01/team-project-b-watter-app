import { usersCollection } from "../bd/models/user.js";
import WaterConsumption from "../bd/models/water.js"


export const getUser = async (id) => {
    const user = await usersCollection.find({_id: id});
    return user;
};

export const addUserPhoto = async (id, url, options = {}) => {
    const updatedUser = await usersCollection.findByIdAndUpdate({_id: id}, {photo: url}, {new: true,
        includeResultMetadata: true, ...options});

    return updatedUser.photo;
};

export const patchUser = async (id, data, options = {}) => {
    const updatedUser = await usersCollection.findByIdAndUpdate({_id: id}, data, {
        new: true,
        includeResultMetadata: true,
        ...options,
    });
    return updatedUser;
};

export const patchUserDailyWaterIntake = async (id, data, options = {}) => {
    const updatedUser = await usersCollection.findByIdAndUpdate({_id: id}, data, {
        new: true,
        includeResultMetadata: true,
        ...options,
    });

    return updatedUser.dailyWaterIntake
};


export const getUserDailyWaterConsumption = async (userId) => {
  const user = await getUser(userId);
  const dailyNorm = user[0].dailyWaterIntake || 2000;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const dailyRecords = await WaterConsumption.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  const totalConsumed = dailyRecords.reduce((total, record) => total + record.amount, 0);
  const percentageOfNorm = (totalConsumed / dailyNorm) * 100;

  return { percentageOfNorm, dailyRecords };
};