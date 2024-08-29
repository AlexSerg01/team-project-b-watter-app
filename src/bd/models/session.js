import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    accessTokenValidUntil: {
        type: Date,
        required: true,
    },
},{
    timestamps: true,
    versionKey: false,
});

export const sessionCollection = model('sessions', sessionSchema);
