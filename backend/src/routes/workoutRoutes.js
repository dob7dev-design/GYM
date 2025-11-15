const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const workoutController = require('../controllers/workoutController');

router.get('/', authMiddleware, workoutController.getAllWorkouts);
router.post('/', authMiddleware, workoutController.createWorkout);

module.exports = router;
