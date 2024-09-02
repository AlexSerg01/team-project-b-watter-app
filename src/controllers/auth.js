import { FIFTEEN_MINUTES } from "../constants/authConstants.js";
import { registerUser, loginUser, logoutUser, requestResetToken } from "../services/auth.js";

function setupSession (res, session) {
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + FIFTEEN_MINUTES),
    });
};

export const registerController = async (req, res) => {
    const user = await registerUser(req.body);
    const userData = user.toJSON();

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: userData,
    });
};

export const loginController = async (req, res) => {
    const session = await loginUser(req.body);
    setupSession(res, session);
    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {accessToken: session.accessToken},

    });
};

export const logoutController = async (req, res) => {
    if(req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    };
    res.clearCookie('sessionId');
    res.status(204).send();

};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};
