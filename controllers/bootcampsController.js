const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
/* Desc: Obter todos os bootcamps
 *  ROTA: GET /api/v1/bootcamps
 *  ACESSO: Public
 */

exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res.status(200).json({
			success: true,
			results: bootcamps.length,
			data: bootcamps
		});
		if (!bootcamp) {
			return res.status(404).json({
				success: false,
				error: "No bootcamps found with the given ID."
			});
		}
	} catch (error) {
		next(error);
	}
};

/* Desc: Obter um único bootcamp
 *  ROTA: GET /api/v1/bootcamps/:id
 *  ACESSO: Public
 */

exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);
		res.status(200).json({ success: true, data: bootcamp });
		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}
	} catch (error) {
		// res.status(400).json({ success: false, error });
		next(error);
	}
};

/* Desc: Criar um novo bootcamp
 *  ROTA: POST /api/v1/bootcamps/
 *  ACESSO: Privado
 */

exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		console.log(bootcamp);

		res.status(201).json({
			success: true,
			data: bootcamp
		});
	} catch (error) {
		next(error);
	}
};

/* Desc: Alterar um bootcamp
 *  ROTA: PUT /api/v1/bootcamps/:id
 *  ACESSO: Privado
 */

exports.updateBootcamp = async (req, res, next) => {
	try {
		const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true
			}
		);
		if (!updatedBootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ success: true, data: updatedBootcamp });
	} catch (error) {
		next(error);
	}
};

/* Desc: Deletar um bootcamp
 *  ROTA: DELETE /api/v1/bootcamps/:id
 *  ACESSO: Privado
 */

exports.deleteBootcamp = async (req, res, next) => {
	try {
		const removeBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
		if (!removeBootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ success: true, deleted: true, data: req.body });
	} catch (error) {
		next(error);
	}
};
