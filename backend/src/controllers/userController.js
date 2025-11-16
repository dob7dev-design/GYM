const userModel = require('../models/userModel');

exports.getMyProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const profile = await userModel.getFullUserProfileById(userId);
		if (!profile) {
			return res.status(404).json({error: 'Profile not found'});
		}	
		res.json(profile);
	
	} catch (err) {
		console.log(err);
		res.status(500).send('Server error');

	}
};

exports.deleteMyAccount = async (req, res) => {
	try {
		const userId = req.user.id;
		const deletedUser = await userModel.deleteUserById(userId);
		if ( !deletedUser ) {
			return res.status(404).json({error : 'User not found.'});
		}
		res.json({ message : 'User account and all associated data has been deleted.', user: deletedUser });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
}
