const express = require('express');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/coursesController');

const Course = require('../models/Courses');
const customResults = require('../middlewares/customResults');
/*  Esse objeto com mergeParams é necessário por conta do relacionamento com bootcamps
 *   A rota para obter os cursos provém dos Bootcamps (ver arquivo bootcamps, nessa mesma pasta)
 */
const router = express.Router({ mergeParams: true });
router
	.route('/')
	.get(
		customResults(Course, {
			path: 'bootcamp',
			select: 'name description'
		}),
		getCourses
	)
	.post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);
module.exports = router;
