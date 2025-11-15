const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const workoutRoutes = require('./workoutRoutes');

router.use('/auth', authRoutes);
router.use('/workouts', workoutRoutes);

module.exports = router;
