const express = require('express');
const { getCourses, getCourse, addCourse } = require('../controllers/coursesController');

/*  Esse objeto com mergeParams é necessário por conta do relacionamento com bootcamps
 *   A rota para obter os cursos provém dos Bootcamps (ver arquivo bootcamps, nessa mesma pasta)
 */
const router = express.Router({ mergeParams: true });
router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse);
module.exports = router;
