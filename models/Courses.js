const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please add a course title."],
		description: {
			type: String,
			required: [true, "Please add a description."]
		},
		weeks: {
			type: String,
			required: [true, "Please add number of weeks."]
		},
		tuition: {
			type: Number,
			required: [true, "Please add a tiotion cost."]
		},
		minimumSkill: {
			type: String,
			required: [true, "Please add a minimum Skill required for the course."],
			enum: [
				"junior",
				"pleno",
				"senior",
				"arquiteto",
				"especialista",
				"engenheiro"
			]
		},
		scolarshipAvailable: {
			type: Boolean,
			default: false
		},
		// Relacionamento entre Esse Schema e o Schema de Bootcamps
		bootcamp: {
			type: mongoose.Schema.ObjectId,
			ref: "Bootcamp",
			required: true
		},
		createdAt: {
			type: Date,
			default: Date.now()
		}
	}
});

module.exports = mongoose.model("Course", CourseSchema);
