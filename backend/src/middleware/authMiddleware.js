const jwt = require('jsonwebtoken');

function authMiddleware ( req, res, next ) {
	const authHeader = req.header('Authorization');

	if ( !authHeader ) {
		return res.status(401).json({error: 'Access denied. No token provided. '});
	}
	const tokenParts = authHeader.split(' ');
	if ( tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
		return res.status(401).json({error: 'Invalid token format. Must be "Bearer <token>".'});
	}
	const token = tokenParts[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch ( err ) {
		console.error('Invalid token: ', err.message);
		res.status(401).json({error: 'Token is not valid.'});
	}
}

module.exports = authMiddleware;
