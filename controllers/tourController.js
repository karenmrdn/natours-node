const Tour = require('../models/tourModel');

// ROUTER HANDLERS

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
      const sortBy = req.query.sort.replace(',', ' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // const query = Tour.find({
    //   duration: req.query.duration,
    //   difficulty: req.query.difficulty,
    // });
    //         --- OR ---
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(req.query.duration)
    //   .where('difficulty')
    //   .equals(req.query.difficulty);

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
