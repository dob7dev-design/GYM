const db = require('../config/db');

exports.findUserByEmail = async (email) => {
	const sql = 'SELECT * FROM users WHERE email = $1';
	const { rows } = await db.query(sql, [email]);
	return rows[0];
};

exports.createUser = async (name, email, passwordHash) => {
	const sql = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
	const { rows } = await db.query(sql, [name, email, passwordHash]);
	return rows[0];
};

exports.getFullUserProfileById = async (userId) => {
	const sql = `SELECT u.id, u.name, u.email, u.role, u.height_cm, u.weight_kg, u.trainer_id, t.name AS trainer_name, t.email AS trainer_email FROM users u LEFT JOIN users t ON u.trainer_id = t.id WHERE u.id = $1`;
	const { rows } = await db.query(sql, [userId]);
	return rows[0];
}

exports.deleteUserById = async (userId) => {
	const sql = 'DELETE FROM users WHERE id = $1 RETURNING *';
	const { rows } = await db.query(sql, [userId]);
	return rows[0];
}
