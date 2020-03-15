const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
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

/* Desc: Pegar o usuario logado na aplicacao
 *  ROTA: POST /api/v1/auth/me
 *  ACESSO: Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		data: user
	});
});

/* Desc: Alterar dados do usuario 
 *  ROTA: PUT /api/v1/auth/updatedetails
 *  ACESSO: Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email
	};
	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		data: user
	});
});

/* Desc: Alterar a senha (sem ter esquecido, no caso, usuario logado)
 *  ROTA: POST /api/v1/auth/updatepassword
 *  ACESSO: Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	// Verificar a senha atual
	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse('Password is incorrect', 401));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

/* Desc: Esqueceu a senha
 *  ROTA: POST /api/v1/auth/forgotpassword
 *  ACESSO: Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new ErrorResponse("There's no user with the given email", 404));
	}

	// Restar o token

	const resetToken = user.getResetPasswordToken();
	console.log(resetToken);
	await user.save({ validateBeforeSave: false });

	// Create = reset url
	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `You are recieving this email because you (or someone else) has
	requested the reset of a password. Plase, make a put request to \n\n ${resetUrl}`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Password reset token',
			message
		});

		res.status(200).json({ success: true, data: 'Email sent' });
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse('Email could not be sent', 500));
	}
	res.status(200).json({
		success: true,
		data: user
	});
});

/* Desc: Resetar a senha
 *  ROTA: PUT /api/v1/auth/resetpassword/:resettoken
 *  ACESSO: Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// Obter o token  "hasheado"
	const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() }
	});
	if (!user) {
		return next(new ErrorResponse('Invalid token', 400));
	}

	// Criar uma nova senha
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.passwordExpire = undefined;

	await user.save();

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
