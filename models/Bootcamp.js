const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please, insert a name for the Bootcamp"],
		unique: true,
		trim: true,
		maxlength: [50, "Name cannot be more than 50 characters"]
	},
	slug: String,
	description: {
		type: String,
		required: [true, "Please, insert a description for the Bootcamp"],
		maxlength: [500, "A Description is necessary."]
	},
	website: {
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			"Please, use a valid URL with HTTP or HTTPS"
		]
	},
	phone: {
		type: Number,
		maxlength: [20, "Phone number cannot be longer than 20 numbers"]
	},
	email: {
		type: String,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please, add a valid email"
		]
	},
	address: {
		type: String,
		required: [true, "Please, add an address"]
	},
	location: {
		// É um GeoJSON point
		type: {
			type: String,
			enum: ["Point"],
			required: true
		}
	},
	coordinates: {
		type: [Number],
		required: true,
		index: "2dsphere"
	},
	formattedAddress: String,
	street: String,
	city: String,
	state: String,
	zipcode: String,
	country: String,
	carreers: {
		type: [String],
		required: true,
		enum: [
			"Web Development",
			"Mobile Development",
			"UI/UX",
			"Data Science",
			"Business",
			"Others"
		]
	},
	averageRating: {
		type: Number,
		min: [1, "Rating must be at least 1"],
		max: [10, "Rating cannot be more than 10"]
	},
	averageCost: Number,
	photo: {
		type: String,
		default: "no-photo.jpg"
	},
	housing: {
		type: Boolean,
		default: false
	},
	jobAssistance: {
		type: Boolean,
		default: false
	},
	jobGuarantee: {
		type: Boolean,
		default: false
	},
	acceptGi: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
