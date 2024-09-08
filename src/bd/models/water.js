import mongoose from 'mongoose';

const waterConsumptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dailyNorm: {
      type: Number,
      required: true,
    },
    percentageConsumed: {
      type: Number,
      required: true,
    },
    consumedWaterByDay: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterConsumptionCollection = mongoose.model(
  'WaterConsumption',
  waterConsumptionSchema,
);
