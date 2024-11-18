import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// import dotenv from 'dotenv';
// dotenv.config();
// const DB_URL = process.env.DB_URL;

// export async function initMongoConnection() {
//   await mongoose.connect(DB_URL);
// }

export const initMongoConnection = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=University`,
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
