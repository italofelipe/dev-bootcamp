const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	// Logar no console
	console.log(err.red);

	// Mongoose Bad Object ID
	console.log(err.name.red.bold.underline);

	// Tratamento para "Not Found"
	if (err.name === "CastError") {
		const notFoundmessage = `Resource not found with id of ${err.value}`;
		error = new ErrorResponse(notFoundmessage, 404);
	}
	// Tratamento para erros de validação
	if (err.name === "ValidationError") {
		const validateMessage = Object.values(err.errors).map(val => val.message);
		error = new ErrorResponse(validateMessage, 400);
	}
	// Tratamento para duplicatas de registros. 11000 é o codigo de erro que o Mongoose retorna
	if (err.code === 11000) {
		const duplicateMessage = `Already exists a resource with the given id`;
		error = new ErrorResponse(duplicateMessage, 400);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error. Something went wrong."
	});
};

module.exports = errorHandler;
