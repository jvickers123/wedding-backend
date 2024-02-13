import { config } from 'dotenv';
config({
  path: '../config/config.env',
});

import fs from 'fs';
import mongoose from 'mongoose';
import 'colors';
import Guest from './models/Guests';
import User from './models/User';

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI!);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/guests.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

// Import into db
const importData = async () => {
  try {
    await Guest.create(bootcamps);
    await User.create(users);
    console.log('Data imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Guest.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
