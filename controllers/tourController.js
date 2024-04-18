const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');

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
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const tours = await features.query;

    // Send response
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
