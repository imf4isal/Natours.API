const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../Model/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('db connection succesful'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('successfully imported data');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
