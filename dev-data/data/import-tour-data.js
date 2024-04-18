const mongoose = require('mongoose');

const fs = require('fs');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Tour = require('../../models/tourModel');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected successfully'));

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted all tours');
  } catch (err) {
    console.log('ERROR: ', err);
  }
  process.exit();
};

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Imported all tours');
  } catch (err) {
    console.log('ERROR: ', err);
  }
  process.exit();
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// node dev-data/data/import-tour-data.js --import
// node dev-data/data/import-tour-data.js --delete
