/* Desc: Obter todos os bootcamps
 *  ROTA: GET /api/v1/bootcamps
 *  ACESSO: Public
 */

exports.getBootcamps = (req, res, next) => {
	res.status(200).json({ success: true, msg: "Showing a list of botocamps." });
};

/* Desc: Obter um único bootcamp
 *  ROTA: GET /api/v1/bootcamps/:id
 *  ACESSO: Public
 */

exports.getBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Showing bootcamp ${req.params.id}` });
};

/* Desc: Criar um novo bootcamp
 *  ROTA: POST /api/v1/bootcamps/
 *  ACESSO: Privado
 */

exports.createBootcamp = (req, res, next) => {
	res.status(200).json({ success: true, msg: "Create a botocamps." });
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
