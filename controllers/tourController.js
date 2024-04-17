const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkCreateTourBody = (req, res, next) => {
  const { body } = req;
  if (!body?.name || !body?.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing {name} or {price}' });
  }
  next();
};

exports.checkId = (req, res, next, id) => {
  const tour = tours.find((tour) => tour.id === +id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  next();
};

// ROUTER HANDLERS

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);

  res.status(200).json({ status: 'success', data: { tour } });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };
  const newTours = [...tours, newTour];

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      if (err) res.status(500).json({ status: 'fail', message: err.message });

      res.status(201).json({ status: 'success', data: { tour: newTour } });
    },
  );
};

exports.updateTour = (req, res) => {
  const { id } = req.params;
  const targetTour = tours.find((tour) => tour.id === +id);

  const updatedTour = Object.assign(targetTour, req.body);
  const newTours = tours.map((tour) => (tour.id === +id ? updatedTour : tour));

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      if (err) res.status(500).json({ status: 'fail', message: err.message });

      res.status(200).json({ status: 'success', data: { tour: updatedTour } });
    },
  );
};

exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const newTours = tours.filter((tour) => tour.id !== +id);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      if (err) res.status(500).json({ status: 'fail', message: err.message });

      res.status(204);
    },
  );
};
