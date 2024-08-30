import { usersCollection } from "../bd/models/user.js";


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


