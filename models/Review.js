const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
    required: [ true, 'Please add a title for the review.' ],
    maxlength: 100
	},
	text: {
		type: String,
		required: [ true, 'Please add some text to your review.' ]
	},
	rating: {
		type: Number,
    min: 1,
    maximum: 10,
    required: [ true, 'Please add a rating between 1 and 10' ]
	},
	// Relacionamento entre Esse Schema e o Schema de Bootcamps
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true
	},
	// Relacionamento entre Esse Schema e o Schema de User

	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

// Impedir o usuario de mandar mais de 1 Review por Bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })


// Static Method para pegar a media de avaliacoes (Ratings)
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId }
		},
		{
			$group: {
				_id: '$bootcamp',
				averageRating: { $avg: '$rating' } // aqui instanciei qual elemento da model eu quero fazer
				// usar o operador $avg, no caso, quero o campo rating
			}
		}
	]);
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageRating: obj[0].averageRating
		});
	} catch (err) {
		console.error(err);
	}
};

// Chamar um metodo getAverageCost apos salvar
ReviewSchema.post('save', function() {
	this.constructor.getAverageRating(this.bootcamp);
});

// Chamar um metodo getAverageRating antes de rmeover
ReviewSchema.pre('remove', function() {
	this.constructor.getAverageRating(this.bootcamp);
});



module.exports = mongoose.model('Review', ReviewSchema);
