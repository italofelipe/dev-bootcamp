// Dependências Globais
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");

// Um Logger feito do 0, puramente para fins de estudo
// const logger = require("./middlewares/logger");
// app.use(logger);

// Middleware de Logging com Morgan
process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : null;

// String padrão de rotas
const defaultRoute = "/api/v1";

// Arquivos de ROTAS
const bootcamps = require("./routes/bootcamps");

// Mount Rotas
app.use(`${defaultRoute}/bootcamps`, bootcamps);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
