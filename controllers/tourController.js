const Tour = require('../models/tourModel');

// Middlewares

exports.aliasTop5Cheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.fields = 'name,price,ratingsAverage';
  req.query.sort = '-ratingsAverage,price';
  next();
};

// Route handles

exports.getTours = async (req, res) => {
  try {
    // Filtering
    const queryCopy = { ...req.query };
    const excludedField = ['sort', 'page', 'fields', 'limit'];
    excludedField.forEach((field) => delete queryCopy[field]);

    let queryCopyStr = JSON.stringify(queryCopy);
    queryCopyStr = queryCopyStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    let query = Tour.find(JSON.parse(queryCopyStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.replaceAll(',', ' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.replaceAll(',', ' ');
      // this is called projecting
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const documentsCount = await Tour.countDocuments();
      if (skip >= documentsCount) throw new Error('This page does not exist');
    }

    query = query.skip(skip).limit(limit);

    const tours = await query;

    res.status(200).json({
      status: 'success',
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid data sent!' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true, // to return updated tour
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour: updatedTour },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);

    res.status(204);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
