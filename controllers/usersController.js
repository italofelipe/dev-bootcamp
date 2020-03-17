const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

/* Desc: Obter todos os Users (com o usuario autenticado)
 *  ROTA: GET /api/v1/auth/users
		Private
 */
exports.authGetUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.customResults);
});

/* Desc: Obter todos os Users (com o usuario autenticado)
 *  ROTA: GET /api/v1/auth/users
		Private
 */
exports.authGetUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	res.status(200).json({
		success: true,
		data: user
	});
});

/* Desc: Criar um usuario (com o usuario autenticado)
 *  ROTA: POST /api/v1/auth/users
		Private
 */
exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);
	res.status(201).json({
		success: true,
		data: user
	});
});

/* Desc: Editar dados de um usuario (com o usuario autenticado)
 *  ROTA: PUT /api/v1/auth/users/:id
		Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	res.status(200).json({
		success: true,
		data: user
	});
});

/* Desc: Deletar um usuario especifico (com o usuario autenticado)
 *  ROTA: DELETE /api/v1/auth/users/:id
		Private
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
	await User.findOneAndDelete(req.params.id);
	res.status(200).json({
		success: true,
		data: {}
	});
});

/* Desc: Obter todos os Users
 *  ROTA: GET /api/v1/users
		Public
 */

exports.getUsers = asyncHandler(async (req, res, next) => {
	if (req.params.userId) {
		const users = await User.find({ user: req.params.userId });
		return res.status(200).json({
			success: true,
			count: users.length,
			data: users
		});
	} else {
		const users = await User.find();
		res.status(200).json({
			success: true,
			count: users.length,
			data: users
		});
	}
});

/* Desc: Obter um unico User
 *  ROTA: GET /api/v1/user/:id
 *  ACESSO: Public
 */

exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorResponse(`No user with the id of ${req.params.id}`), 404);
	}
	res.status(200).json({
		success: true,
		data: user
	});
});
