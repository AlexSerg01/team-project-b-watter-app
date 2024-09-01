import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addAmountOfConsumedWaterSchema,
  updateAmountOfConsumedWaterSchema,
} from '../validation/water.js';
import {
  getWaterConsumptionByMonth,
  addWaterConsumption,
  updateWaterConsumption,
  getDailyWaterConsumption,
  deleteWaterConsumption,
} from '../controllers/water.js';

const router = Router();

router.use('/', authenticate);

router.post(
  '/',
  validateBody(addAmountOfConsumedWaterSchema),
  ctrlWrapper(addWaterConsumption),
);

router.patch(
  '/:id',
  validateBody(updateAmountOfConsumedWaterSchema),
  ctrlWrapper(updateWaterConsumption),
);

router.delete('/:id', ctrlWrapper(deleteWaterConsumption));

router.get('/', ctrlWrapper(getDailyWaterConsumption));

router.get('/:month/:year', ctrlWrapper(getWaterConsumptionByMonth));

export default router;
