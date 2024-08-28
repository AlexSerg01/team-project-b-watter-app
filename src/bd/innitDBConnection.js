import mongoose from "mongoose";
import { env } from "../utils/env.js";


export const innitMongoConnection = async () => {
    try {
        const user = env('MONGODB_USER');
        const pwd = env('MONGODB_PASSWORD');
        const url = env('MONGODB_URL');
        const db = env('MONGODB_DB');
        await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=waterApp`);
        console.log('MDB conected');
    } catch (err) {
        console.log('init err', err);
    }
};

