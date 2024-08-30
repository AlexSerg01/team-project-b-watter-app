import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addAmountOfConsumedWaterSchema } from '../validation/water.js';
import {
  getWaterConsumptionByMonth,
  addWaterConsumption, getDailyWaterConsumptionController
} from '../controllers/water.js';

const router = Router();

router.get(
  '/:month/:year',
  authenticate,
  ctrlWrapper(getWaterConsumptionByMonth),
);

router.post(
  '/',
  authenticate,
  validateBody(addAmountOfConsumedWaterSchema),
  ctrlWrapper(addWaterConsumption),
);

router.get('/water-consumption', authenticate, ctrlWrapper(getDailyWaterConsumptionController))

export default router;
