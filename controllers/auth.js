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
	sendTokenResponse(user, 200, res);
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
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}

	// Verificar se a senha inserida bate com a senha criptografada no DB
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}
	sendTokenResponse(user, 200, res);
});

// Pegar o token da model, criar um cookie e manda-lo no response

const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();
	const options = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true
	};

	/* if (process.env.NODE_ENV === production) {
		options.secure = true;
	} */
	/* cookie recebe 3 params: 
		1 - chave como chamaremos o cookie,
		2 - valor: O que a nossa chave recebera
		3 - Algum callback ou logica que quisermos implementar
		*/
	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token
	});
};

/* Desc: Pegar o usuario logado na aplicacao
 *  ROTA: POST /api/v1/auth/me
 *  ACESSO: Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id)
	res.status(200).json({
		success: true,
		data: user
	})
})