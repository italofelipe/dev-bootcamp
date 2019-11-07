// Dependencias Globais
const express = require("express");
const Router = express.Router();

// Controllers
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius
} = require("../controllers/bootcampsController");

// Incluir rotas de outros Recursos
/*
	O que estou fazendo aqui: com a linha abaixo, estou basicamente falando que, quando a rota
	começar com "bootcampId/courses", o express vai me redirecionar para a rota de cursos
	Isso é necessário por causa do relacionamento entre bootcamps e cursos.

*/
const courseRouter = require("./courses");
Router.use("/:bootcampId/courses", courseRouter);

Router.route("/")
	.get(getBootcamps)
	.post(createBootcamp);
Router.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);
module.exports = Router;

Router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
