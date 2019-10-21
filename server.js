const express = require("express");
const dotenv = require("dotenv");
// Load .ENV vars

// String padrão de rotas
const defaultRoute = "/api/v1";
dotenv.config({ path: "./config/config.env" });
const app = express();
const PORT = process.env.PORT || 5000;

// GET
app.get(`${defaultRoute}/bootcamps`, (req, res) => {
	res.status(200).json({ success: true, msg: "Showing a list of botocamps." });
});

// GET POR ID
app.get(`${defaultRoute}/bootcamps/:id`, (req, res) => {
	res
		.status(200)
		.json({ success: true, msg: `Showing boot camp ${req.params.id}` });
});

// POST
app.post(`${defaultRoute}/bootcamps`, (req, res) => {
	res.status(200).json({ success: true, msg: "Create a botocamps." });
});

// PUT
app.put(`${defaultRoute}/bootcamps/:id`, (req, res) => {
	res.status(200).json({ success: true, msg: "Updating a bootcamp." });
});

// DELETE
app.delete(`${defaultRoute}/bootcamps/:id`, (req, res) => {
	res.status(200).json({ success: true, msg: "Delete a bootcamp." });
});
app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
