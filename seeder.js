const fs = require('fs');
const Mongoose = require('mongoose');
const colors = require('colors');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Courses');
const User = require('./models/User');
require('dotenv').config({ path: './config/config.env' });

const Review = require('./models/Review');
// Carregar variaveis de ambiente
const  mongodbURI  = process.env.MONGO_URI

Mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

// Ler os arquivos JSON

// Importar os dados dos arquivos JSON para o Banco de dados
const importData = async () => {
	const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
	const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
	const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
	const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));

	try {
		// await Bootcamp.create(bootcamps);
		// await Course.create(courses);
		// await User.create(users);
		await Review.create(reviews);
		console.log('Data imported...'.green.inverse);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

// Deletar Dados
const deleteData = async () => {
	try {
		// await Bootcamp.deleteMany();
		// await Course.deleteMany();
		// await User.deleteMany();
		await Review.deleteMany();
		console.log('Data destroyed...'.red.inverse);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
