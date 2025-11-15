const db = require('../config/db');

exports.getWorkoutByUserId = async (userId) => {
	const sql = 'SELECT * FROM workouts WHERE user_id = $1';
	const { rows } = await db.query(sql, [userId]);
	return rows;
};

exports.createWorkout = async (userId, name, exercises) => {
	const sql = 'INSERT INTO workouts (user_id, name , exercises) VALUES ($1, $2, $3 ) RETURNING *';
	const { rows } = await db.query(sql, [userId, name, exercises]);
	return rows[0];
};
