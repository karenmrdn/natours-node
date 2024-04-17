const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkCreateTourBody,
} = require('../controllers/tourController');

const router = express.Router();

// PARAM MIDDLEWARE
// router.param('id', checkId);

router.route('/').get(getTours).post(checkCreateTourBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
