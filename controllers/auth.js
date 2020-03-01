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

/* Desc: Logar um usuario
 *  ROTA: POST /api/v1/auth/login
 *  ACESSO: Public
 */

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validar email e senha
	if (!email || !password) {
		return next(new ErrorResponse('Please provide an email and password', 400));
	}

	// Validar o usuario
	const user = await await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}

	// Verificar se a senha inserida bate com a senha criptografada no DB
	const isMatch = await user.matchPassword(password)

	if(!isMatch) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}
	// Criar uma token de acesso ao usuario
	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token });
});
