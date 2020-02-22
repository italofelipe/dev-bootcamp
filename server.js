// Dependências Globais
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { port, nodeEnv } = require('./config/config');
const PORT = port || 5000;
// Carregar Variaveis de Ambiente

// Logger Personalziado
const morgan = require('morgan');
const colors = require('colors');
// Tratamento de erro personalizado
const errorhandler = require('./middlewares/error');
// Conectar ao banco
connectDB();
// Iniciar o Express
const app = express();
// Body Parser
app.use(express.json());
app.use(cors());

// Um Logger feito do 0, puramente para fins de estudo
// const logger = require("./middlewares/logger");
// app.use(logger);

// Middleware de Logging com Morgan
if (nodeEnv === 'development') {
	app.use(morgan('dev'));
}

// String padrão de rotas
const defaultRoute = '/api/v1';

// Arquivos de ROTAS
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Mount Rotas
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorhandler);

const server = app.listen(PORT, () => {
	console.log(`Server running in ${nodeEnv} mode on port ${port}`.yellow.bold);
});
// Handle unhandled promise Rejections

process.on('unhandledrejection', (err, promise) => {
	console.log(`Unhandled Rejection: ${err.message}`);
	// Fechar o servidor e matar a aplicação
	server.close(() => process.exit(1));
});
