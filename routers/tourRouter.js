const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTop5Cheap,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const router = express.Router();

// PARAM MIDDLEWARE
// router.param('id', checkId);

// for aliasing we use our own middleware aliasTop5Cheap
router.route('/top-5-cheap').get(aliasTop5Cheap, getTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
