const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Proteger as rotas
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	else if(req.cookies.token) {
    token = req.cookies.token
  }
	// Ter certeza que o Token passado existe
	if (!token) {
		return next(new errorResponse('Not authorized to access this route', 401));
	}
	try {
		// Verificar Token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		// Caso a token seja verdadeira, logar o usuario
		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {}
});

// Garantir acesso a atribuicoes especificas (publisher, user)

exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new errorResponse(`User role ${req.user.role} is unauthorized to access this route`, 403));
		}
		next();
	};
};
