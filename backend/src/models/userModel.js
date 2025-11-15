const db = require('../config/db');

exports.findUserByEmail = async (email) => {
	const sql = 'SELECT * FROM users WHERE email = $1';
	const { rows } = await db.query(sql, [email]);
	return rows[0];
};

exports.createUser = async (name, email, passwordHash) => {
	const sql = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)';
	const { rows } = await db.query(sql, [name, email, passwordHash]);
	return rows[0];
};
