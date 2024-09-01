import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { usersCollection } from '../bd/models/user.js';
import { sessionCollection } from '../bd/models/session.js';
import { FIFTEEN_MINUTES } from '../constants/authConstants.js';

export const registerUser = async (data) => {
    const user = await usersCollection.findOne({email: data.email});
    if(user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(data.password, 10);
    return await usersCollection.create({...data, password: encryptedPassword});

};

export const loginUser = async (data) => {
    const user = await usersCollection.findOne({email: data.email});
    if(!user) throw createHttpError(404, 'User not found');
    const ifPasswordsEqual = await bcrypt.compare(data.password, user.password);
    if(!ifPasswordsEqual) throw createHttpError(401, 'Unauthorized');

    await sessionCollection.deleteOne({userId: user._id});
    const accessToken = randomBytes(30).toString('base64');
  return await sessionCollection.create({
    userId: user._id,
    accessToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  });

};

export const logoutUser = (sessionId) => sessionCollection.deleteOne({_id: sessionId});
