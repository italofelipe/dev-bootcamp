const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

/* Desc: Registrar um usuario
 *  ROTA: POST /api/v1/auth/register
 *  ACESSO: Public
 */

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// Criar Usuario
	const user = await User.create({
		name,
		email,
		password,
		role
	});

	// Criar uma token de acesso ao usuario
	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token });
});
