import createHttpError from 'http-errors';

import {sessionCollection} from '../bd/models/session.js';
import {usersCollection} from '../bd/models/user.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        return next(createHttpError(401, 'Please provide Authorization header'))
    };

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if(bearer !== 'Bearer' || !token) {
       return next(createHttpError(401, 'Auth header should be of type Bearer'));
    };

    const session = await sessionCollection.findOne({accessToken: token});

    if(!session) {
       return next(createHttpError(401, 'Session not found'));
    };

    const isExpired = new Date() > new Date(session.accessTokenValidUntil);

    if(isExpired) {
        return next(createHttpError(401, 'Access token expired'));
    };

    const user = await usersCollection.findById(session.userId);

    if(!user) {
       return next(createHttpError(401, 'User not found'));
    };

    req.user = user;
    next();
};
