import createHttpError from "http-errors";

export const validateWaterDaily = (req, res, next) => {
    const dailyIntake = req.body.dailyWaterIntake
    if(typeof dailyIntake !== 'string' ) {
        const error = createHttpError(400, 'Invalid data');
        return next(error)
    }
    const parsedNumber = parseInt(dailyIntake);
    if(Number.isNaN(parsedNumber)) {
        const error = createHttpError(400, 'Invalid data');
        return next(error)
    };
    next()
};
