const Course = require("../models/Courses");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

/* Desc: Obter todos os Courses
 *  ROTA: GET /api/v1/bootcamps/:bootcampId/courses
 *  ACESSO: Public
 */

exports.getCourses = asyncHandler(async (req, res, next) => {
	let query;

	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else {
		query = Course.find();
	}

	const courses = await query;
	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses
	});
});

/* Desc: Obter todos os bootcamps
 *  ROTA: GET /api/v1/bootcamps
 *  ACESSO: Public
 */
