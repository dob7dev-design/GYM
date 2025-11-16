const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const workoutRoutes = require('./workoutRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/workouts', workoutRoutes);
router.use('/users', userRoutes);

module.exports = router;
