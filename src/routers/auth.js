import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import { registrationValidationSchema, loginSchema } from "../validation/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerController, loginController, logoutController } from "../controllers/auth.js";
import {authenticate} from '../middlewares/authenticate.js'

const router = Router();

router.post('/register', validateBody(registrationValidationSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/logout', authenticate, ctrlWrapper(logoutController));

export default router;
