const mongoose = require('mongoose');
// const { mongodbURI } = require('./config');
require('dotenv').config()
const connectDB = async () => {
	const con = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	});

	console.log(`Database up and running at port ${con.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
