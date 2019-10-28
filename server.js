// Dependências Globais
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
// Carregar Variaveis de Ambiente
dotenv.config({ path: "./config/config.env" });
// Logger Personalziado
const morgan = require("morgan");
const colors = require("colors");
// Conectar ao banco
connectDB();

const app = express();
// Body Parser
app.use(express.json());

// Um Logger feito do 0, puramente para fins de estudo
// const logger = require("./middlewares/logger");
// app.use(logger);

// Middleware de Logging com Morgan
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// String padrão de rotas
const defaultRoute = "/api/v1";

// Arquivos de ROTAS
const bootcamps = require("./routes/bootcamps");

// Mount Rotas
app.use(`${defaultRoute}/bootcamps`, bootcamps);

const server = app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	);
});
// Handle unhandled promise Rejections

process.on("unhandledrejection", (err, promise) => {
	console.log(`Unhandled Rejection: ${err.message}`);
	// Fechar o servidor e matar a aplicação
	server.close(() => process.exit(1));
});
