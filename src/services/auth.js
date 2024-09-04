import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { usersCollection } from '../bd/models/user.js';
import { sessionCollection } from '../bd/models/session.js';
import { FIFTEEN_MINUTES, SMTP } from '../constants/authConstants.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { TEMPLATE_DIR } from '../constants/index.js';

export const registerUser = async (data) => {
  const user = await usersCollection.findOne({ email: data.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(data.password, 10);
  return await usersCollection.create({ ...data, password: encryptedPassword });
};

export const loginUser = async (data) => {
  const user = await usersCollection.findOne({ email: data.email });
  if (!user) throw createHttpError(404, 'User not found');
  const ifPasswordsEqual = await bcrypt.compare(data.password, user.password);
  if (!ifPasswordsEqual) throw createHttpError(401, 'Unauthorized');

  await sessionCollection.deleteOne({ userId: user._id });
  const accessToken = randomBytes(30).toString('base64');
  const session =  await sessionCollection.create({
    userId: user._id,
    accessToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
  });
  return {
    user,
    session
  }
};

export const logoutUser = (sessionId) =>
  sessionCollection.deleteOne({ _id: sessionId });

export const requestResetToken = async (email) => {
  const user = await usersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );
  const templateFile = path.join(TEMPLATE_DIR, 'reset-pasword-email.html');

  const templateSource = await fs.readFile(templateFile, { encoding: 'utf-8' });

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `https://team-project-watter-app.vercel.app/reset-password/${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (password, token) => {
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));

    console.log(decoded);

    const user = await usersCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (user === null) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token not valid');
    }
    throw error;
  }
};
