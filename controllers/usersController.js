const User = require("../models/User")
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

/* Desc: Obter todos os Users
 *  ROTA: GET /api/v1/users
 */

exports.getUsers = asyncHandler(async (req, res, next) => {

	if (req.params.userId) {
		const users = await User.find({ user: req.params.userId });
		return res.status(200).json({
			success: true,
			count: users.length,
			data: users
		})
	} 
	else {
    const users = await User.find()
		res.status(200).json({
      success: true,
      count: users.length,
      data: users
    })
	}

	
});

/* Desc: Obter um unico User
 *  ROTA: GET /api/v1/user/:id
 *  ACESSO: Public
 */

exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)

	if (!user) {
		return next(new ErrorResponse(`No user with the id of ${req.params.id}`), 404);
	}
	res.status(200).json({
		success: true,
		data: user
	});
});