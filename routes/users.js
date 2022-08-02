const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

//@route   POST api/v1/users
//@desc    Register a user
//@access  Public
router.post(
	'/',
	[
		check('first_name', 'first name is required').not().isEmpty(),
		check('last_name', 'last name is required').not().isEmpty(),
		check('username', 'username is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { first_name, last_name, username, email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ msg: 'User already exists' });
			} else {
				user = new User({
					first_name,
					last_name,
					username,
					email,
					password,
				});

				//Hash the password
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(password, salt);
				await user.save();

				//For the web token
				const payload = {
					user: {
						id: user.id,
					},
				};
				jwt.sign(
					payload,
					process.env.JWT_SECRET,
					{
						expiresIn: 3600, //for one hour
					},
					(err, token) => {
						if (err) throw err;
						res.status(200).json({ msg: 'User registered', token });
					}
				);
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ msg: 'Server Error' });
		}
	}
);

module.exports = router;
