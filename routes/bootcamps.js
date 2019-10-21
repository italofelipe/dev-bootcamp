// Dependencias Globais
const express = require("express");
const Router = express.Router();

// Controllers
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp
} = require("../controllers/bootcampsController");

Router.route("/")
	.get(getBootcamps)
	.post(createBootcamp);
Router.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);
module.exports = Router;
