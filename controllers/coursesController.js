const Course = require('../models/Courses');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

/* Desc: Obter todos os Courses
 *  ROTA: GET /api/v1/bootcamps/:bootcampId/courses
 *  ACESSO: Public
 */

exports.getCourses = asyncHandler(async (req, res, next) => {
	let query;

	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else {
		query = Course.find().populate({
			path: 'bootcamp',
			select: 'name description'
		});
	}

	const courses = await query;
	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses
	});
});

/* Desc: Obter um unico Course
 *  ROTA: GET /api/v1/courses/:id
 *  ACESSO: Public
 */

exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description'
	});

	if (!course) {
		return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
	}
	res.status(200).json({
		success: true,
		data: course
	});
});

/* Desc: Criar um Course
 *  ROTA: POST /api/v1/bootcamps/:bootCampId/courses
 *  ACESSO: Private
 */

exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
	}

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		data: course
	});
});

/* Desc: Editar um Course
 *  ROTA: PUT /api/v1/courses/:id
 *  ACESSO: Private
 */

exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		success: true,
		data: course
	});
});

/* Desc: Editar um Course
 *  ROTA: DELETE /api/v1/courses/:id
 *  ACESSO: Private
 */

exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
	}

	await Course.remove()
	res.status(200).json({success: true, data: {}	});
});
