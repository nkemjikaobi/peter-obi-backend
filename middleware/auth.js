const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	//Get the token from the header
	const token = req.header('authorization');

	//Check if the token does not exist
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token not valid' });
	}
};
