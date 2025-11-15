const workoutModel = require('../models/workoutModel');

exports.getAllWorkouts = async (req, res) => {
	try {
		const userId = req.user.id;
		const workouts = await workoutModel.getWorkoutesByUserId(userId);
		res.json(workouts);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server error');
	}
};

exports.createWorkout = async (req, res) => {
	try {
		const userId = req.user.id;
		const {name, exercises } = req.body;
		const newWorkout = await workoutModel.createWorkout(userId, name, exercises );
		res.status(201).json(newWorkout);

	} catch (err) {
		console.log(error);
		res.status(500).send('Server error');
	}
};
