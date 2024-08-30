import { getUser, addUserPhoto, patchUser, patchUserDailyWaterIntake, getUserDailyWaterConsumption } from "../services/user.js";
import {saveFileToCloudinary} from '../utils/saveFileToCloudinary.js'
import { deleteFileFromCloudinary } from "../utils/deleteFileFromCloudinary.js";

export const getUserInfoController = async (req, res) => {
    const user = await getUser(req.user._id)
    res.status(200).json({
        status: 200,
        message: 'Successfully found a user!',
        data: user
    })
};

export const addUserPhotoController = async (req, res) => {
    const contactId = req.user._id;
    const photo = req.file;
    const user = await getUser(contactId);
    const oldPhoto = user[0].photo;
    if (oldPhoto) {
        await deleteFileFromCloudinary(oldPhoto);
    }
    const photoURL = await saveFileToCloudinary(photo);
    const userPhoto = await addUserPhoto(contactId, photoURL);
    res.status(200).json({
        status: 200,
        message: 'Photo has been added successfully',
        data: {photoUrl: userPhoto}
    });
}

export const patchUserController = async (req, res) => {
    const contactId = req.user._id;
    const updatedUser = await patchUser(contactId, req.body);

    res.status(200).json({
        status: 200,
        message: 'User has been updated successfully',
        data: updatedUser,
    });
};

export const patchDailyWaterIntakeController = async (req, res) => {
    const contactId = req.user._id;
    const newDailyIntake = parseInt(req.body.dailyWaterIntake)
    const updatedDailyWaterIntake = await patchUserDailyWaterIntake(contactId, {dailyWaterIntake: newDailyIntake});
    res.status(200).json({
        status: 200,
        message: 'Daily water intake has been successfully updated',
        data: {dailyWaterIntake: updatedDailyWaterIntake},
    });
};

export const getDailyWaterConsumptionController = async (req, res) => {
        const contactId = req.user._id;
        const { percentageOfNorm, dailyRecords } = await getUserDailyWaterConsumption(contactId);

        res.status(200).json({
            status: 200,
            message: 'Successfully retrieved daily water consumption data',
            data: {
                percentageOfNorm,
                dailyRecords
            }
        });
};