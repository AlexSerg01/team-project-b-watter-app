import { Schema, model } from "mongoose";

const usersSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    dailyWaterIntake: {
        type: Number,
        required: false,
    },
    email: {
        type: String,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false,
    }
},
{
    timestamps: true,
    versionKey: false,
});


usersSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  };

export const usersCollection = model('users', usersSchema);
