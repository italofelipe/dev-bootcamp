const mongoose = require("mongoose");
console.log(process.env.MONGO_URI);
const connectDB = async () => {
	const con = await mongoose.connect(
		"mongodb+srv://italofelipe:3672120Felipe*@cluster0-3kwlg.mongodb.net/devcamper"
	);

	console.log(
		`Database up and running at port ${con.connection.host}`.cyan.underline.bold
	);
};

module.exports = connectDB;
