import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { usersCollection } from "../bd/models/user.js"


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

    return updatedUser.value.dailyWaterIntake
};


