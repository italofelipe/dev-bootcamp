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

Router.route("/")
	.get(getBootcamps)
	.post(createBootcamp);
Router.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);
module.exports = Router;

Router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
