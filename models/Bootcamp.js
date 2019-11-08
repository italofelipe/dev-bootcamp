const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

// Nota: Slugs servem pra criar uma URL (rotas) mais amigável ao Front End com base no nome do Bootcamp.
const BootcampSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'Please add a name' ],
			unique: true,
			trim: true,
			maxlength: [ 50, 'Name can not be more than 50 characters' ]
		},
		slug: String,
		description: {
			type: String,
			required: [ true, 'Please add a description' ],
			maxlength: [ 500, 'Description can not be more than 500 characters' ]
		},
		website: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				'Please use a valid URL with HTTP or HTTPS'
			]
		},
		phone: {
			type: String,
			maxlength: [ 20, 'Phone number can not be longer than 20 characters' ]
		},
		email: {
			type: String,
			match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
		},
		address: {
			type: String,
			required: [ true, 'Please add an address' ]
		},
		location: {
			// GeoJSON Point
			type: {
				type: String,
				enum: [ 'Point' ]
			},
			coordinates: {
				type: [ Number ],
				index: '2dsphere'
			},
			formattedAddress: String,
			street: String,
			city: String,
			state: String,
			zipcode: String,
			country: String
		},
		careers: {
			// Array of strings
			type: [ String ],
			required: true
		},
		averageRating: {
			type: Number,
			min: [ 1, 'Rating must be at least 1' ],
			max: [ 10, 'Rating must can not be more than 10' ]
		},
		averageCost: Number,
		photo: {
			type: String,
			default: 'no-photo.jpg'
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Criar um "slug" de bootcamp a partir de seu nome
BootcampSchema.pre('save', function(next) {
	this.slug = slugify(this.name, { lower: true });
	console.log('Slugify ran', this.name);
	next();
});

// Geocode & Criar campo de localização
BootcampSchema.pre('save', async function(next) {
	const location = await geocoder.geocode(this.address);
	this.location = {
		type: 'Point',
		coordinates: [ location[0].longitude, location[0].latitude ],
		formattedAddress: location[0].formattedAddress,
		street: location[0].streetName,
		city: location[0].city,
		state: location[0].stateCode,
		zipcode: location[0].zipcode,
		country: location[0].countryCode
	};

	// No curso foi feito isso, mas eu quis deixar salvar no banco de dados o endereço do usuario,
	// por isso, nao executei a linha de codigo abaixo

	// this.address = undefined
	next();
});
// Exclusao em cascata (deletar um bootcamp tb deleta os documentos atrelados ao Bootcamp)
BootcampSchema.pre('remove', async function(next) {
	console.log(`Courses  beign removed from Bootcamp ${this._id}`);
	await this.model('Course').deleteMany({ bootcamp: this._id });
	next();
});

/* Populate inverso usando o Virtuals 
*		Virtuals e uma maneira de fazermos queries e receber algum campo que
*		nao esteja de fato em nosso documento.
*		Por exemplo: Ao listar bootcamps, nao recebemos cursos, mas gracas ao Virtuals,
*		isso sera possivel. Ele simula que uma determinada tenha relacionamento com
*		outra model, mesmo que na pratica, elas nao tenham. Ele simula isso e retorna.
*/
BootcampSchema.virtual('courses', {
	ref: 'Course',
	localField: '_id',
	foreignField: 'bootcamp',
	justOne: false
});
module.exports = mongoose.model('Bootcamp', BootcampSchema);
