const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
	const {name, email, password} = req.body;

	try {
		const existingUser = await userModel.findUserByEmail(email);
		if ( existingUser ) {
			return res.status(409).json({error: 'Email already in use. '});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = await userModel.createUser(name, email, hashedPassword);

		res.status(201).json({
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
};

exports.login = async (req, res) => {

}
