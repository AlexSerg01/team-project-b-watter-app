import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { usersCollection } from "../bd/models/user.js"
import { WaterConsumptionCollection } from '../bd/models/water.js';


export const getUser = async (id) => {
    const user = await usersCollection.find({_id: id});
    return user;
};

export const addUserPhoto = async (id, url, options = {}) => {
    const updatedUser = await usersCollection.findByIdAndUpdate({_id: id}, {photo: url}, {new: true,
        includeResultMetadata: true, ...options});
    return updatedUser.value.photo;
};

export const patchUser = async (id, data, options = {}) => {
    const updateData = {...data}
    if(data.password) {
        const user = await usersCollection.findById(id)
        const ifPasswordsEqual = await bcrypt.compare(data.password, user.password);
        if (ifPasswordsEqual) throw createHttpError(400, 'New password cannot be the same as the old password');
        const encryptedPassword = await bcrypt.hash(data.password, 10);
        updateData.password = encryptedPassword
    }
    const updatedUser = await usersCollection.findByIdAndUpdate({_id: id}, updateData, {
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

    const today = Date.now()

    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const todayRecords = await WaterConsumptionCollection.find({
        userId: id,
        date: { $gte: startDate, $lt: endDate },
      }).sort({ date: 1 });

      for (const curr of todayRecords) {
        const newNote = {
            percentageConsumed: (curr.amount / updatedUser.value.dailyWaterIntake) * 100,
            dailyNorm: updatedUser.value.dailyWaterIntake
        };
        await WaterConsumptionCollection.findByIdAndUpdate(curr._id, newNote);
    }

    return updatedUser.value.dailyWaterIntake
};


