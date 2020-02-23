const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [ true, 'Please add a course title.' ]
	},
	description: {
		type: String,
		required: [ true, 'Please add a description.' ]
	},
	weeks: {
		type: String,
		required: [ true, 'Please add number of weeks.' ]
	},
	tuition: {
		type: Number,
		required: [ true, 'Please add a tiotion cost.' ]
	},
	minimumSkill: {
		type: String,
		required: [ true, 'Please add a minimum Skill required for the course.' ],
		enum: [ 'junior', 'pleno', 'senior', 'arquiteto', 'especialista', 'engenheiro' ]
	},
	scolarshipAvailable: {
		type: Boolean,
		default: false
	},
	// Relacionamento entre Esse Schema e o Schema de Bootcamps
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

// Static Method para pegar o custo medio do curso
CourseSchema.statics.getAverageCost = async function(bootcampId) {
	console.log('Calculando o custo medio....'.blue);
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId }
		},
		{
			$group: {
				_id: '$bootcamp',
				averageCost: { $avg: '$tuition' } // aqui instanciei qual elemento da model eu quero fazer
				// usar o operador $avg, no caso, quero o campo tuition
			}
		}
	]);
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10
		});
	} catch (err) {
		console.error(err);
	}
};

// Chamar um metodo getAverageCost apos salvar
CourseSchema.post('save', function() {
	this.constructor.getAverageCost(this.bootcamp);
});

// Chamar um metodo getAverageCost antes de rmeover
CourseSchema.pre('remove', function() {
	this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
