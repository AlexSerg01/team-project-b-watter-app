import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { getWaterConsumptionByMonth } from '../controllers/water.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get(
  '/:month/:year',
  authenticate,
  ctrlWrapper(getWaterConsumptionByMonth),
);

export default router;
