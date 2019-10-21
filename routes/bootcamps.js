// Dependencias Globais
const express = require("express");
const Router = express.Router();

// GET
Router.get(`/`, (req, res) => {
	res.status(200).json({ success: true, msg: "Showing a list of botocamps." });
});

// GET POR ID
Router.get(`/:id`, (req, res) => {
	res
		.status(200)
		.json({ success: true, msg: `Showing bootcamp ${req.params.id}` });
});

// POST
Router.post(`/`, (req, res) => {
	res.status(200).json({ success: true, msg: "Create a botocamps." });
});

// PUT
Router.put(`/:id`, (req, res) => {
	res.status(200).json({ success: true, msg: "Updating a bootcamp." });
});

// DELETE
Router.delete(`/:id`, (req, res) => {
	res.status(200).json({ success: true, msg: "Delete a bootcamp." });
});

module.exports = Router;
