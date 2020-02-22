const fs = require('fs');
const Mongoose = require('mongoose');
const colors = require('colors');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Courses');
// Carregar variaveis de ambiente
const { mongodbURI } = require('./config/config');

Mongoose.connect(mongodbURI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

// Ler os arquivos JSON
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

// Importar os dados dos arquivos JSON para o Banco de dados
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		console.log('Data imported...'.green.inverse);
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

// Deletar Dados
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
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
