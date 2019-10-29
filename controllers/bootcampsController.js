const Bootcamp = require("../models/Bootcamp");

/* Desc: Obter todos os bootcamps
 *  ROTA: GET /api/v1/bootcamps
 *  ACESSO: Public
 */

exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.find();
		res.status(200).json({
			success: true,
			data: bootcamp
		});
	} catch (error) {
		res.status(404).json({ success: false, error });
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
	} catch (error) {
		res.status(404).json({ success: false, error });
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
		res.status(400).json({ success: false, error });
	}
};

/* Desc: Alterar um bootcamp
 *  ROTA: PUT /api/v1/bootcamps/:id
 *  ACESSO: Privado
 */

exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, msg: "Updating a bootcamp." });
};

/* Desc: Deletar um bootcamp
 *  ROTA: DELETE /api/v1/bootcamps/:id
 *  ACESSO: Privado
 */

exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, msg: "Delete a bootcamp." });
};
