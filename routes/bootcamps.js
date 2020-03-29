// Dependencias Globais
const express = require("express");
const Router = express.Router();
const { protect, authorize } = require('../middlewares/auth')

// Controllers
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload
} = require("../controllers/bootcampsController");

const Bootcamp = require("../models/Bootcamp")
const customResults = require('../middlewares/customResults.js')

// Incluir rotas de outros Recursos
/*
	O que estou fazendo aqui: com a linha abaixo, estou basicamente falando que, quando a rota
	começar com "bootcampId/courses", o express vai me redirecionar para a rota de cursos
	Isso é necessário por causa do relacionamento entre bootcamps e cursos.

*/
const courseRouter = require("./courses");
const reviewsRouter = require("./reviews");
Router.use("/:bootcampId/courses", courseRouter); 
Router.use("/:bootcampId/reviews", reviewsRouter);

Router.route("/")
	.get(customResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp);
Router.route("/:id")
	.get(getBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect,authorize('publisher', 'admin'), deleteBootcamp);
module.exports = Router;

Router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

Router.route("/:id/photo").put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)