const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
/* Desc: Obter todos os bootcamps
 *  ROTA: GET /api/v1/bootcamps
 *  ACESSO: Public
 */

exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;
	let queryStr = JSON.stringify(req.query);

	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
	console.log(queryStr);

	query = Bootcamp.find(JSON.parse(queryStr));
	const bootcamps = await query;
	res.status(200).json({
		success: true,
		results: bootcamps.length,
		data: bootcamps
	});
});

/* Desc: Obter um único bootcamp
 *  ROTA: GET /api/v1/bootcamps/:id
 *  ACESSO: Public
 */

exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	res.status(200).json({ success: true, data: bootcamp });
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
});

/* Desc: Criar um novo bootcamp
 *  ROTA: POST /api/v1/bootcamps/
 *  ACESSO: Privado
 */

exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	console.log(bootcamp);

	res.status(201).json({
		success: true,
		data: bootcamp
	});
});

/* Desc: Alterar um bootcamp
 *  ROTA: PUT /api/v1/bootcamps/:id
 *  ACESSO: Privado
 */

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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
});

/* Desc: Deletar um bootcamp
 *  ROTA: DELETE /api/v1/bootcamps/:id
 *  ACESSO: Privado
 */

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const removeBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!removeBootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.json({ success: true, data: {}, message: "Bootcamp Deleted" });
});

/* Desc: Buscar um bootcamp dentro de um raio
 *  ROTA: GET /api/v1/bootcamps/radius/:cep/:distancia
 *  ACESSO: Publico
 */

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Obter a latitude e Longitude a partir do Geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	/* Calcular raio (em radianos)
		Dividir distancia pelo raio da Terra
		Raio da Terra: 3,963 Milhas ou 6,378 Quilometros
	*/

	const radius = distance / 6378;
	const bootcampsInRadius = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
	});

	res.status(200).json({
		success: true,
		results: bootcampsInRadius.length,
		data: bootcampsInRadius
	});
});
