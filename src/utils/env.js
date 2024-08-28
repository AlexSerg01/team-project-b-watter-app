import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultName) {
    const value = process.env[name];
    if(value) return value;
    if(defaultName) return defaultName;
    throw new Error('Oops');
}
