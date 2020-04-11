// Dependências Globais
const express = require('express');
const path = require('path');
require('dotenv').config({ path: './config/config.env' });
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
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
// Cookie Parser
app.use(cookieParser());

// Cors para se conectar ao Front End
app.use(cors());

// Um Logger feito do 0, puramente para fins de estudo
// const logger = require("./middlewares/logger");
// app.use(logger);

// Middleware de Logging com Morgan
if (nodeEnv === 'development') {
	app.use(morgan('dev'));
}

// File Upload
app.use(fileUpload());

// Middleware do Mongo-Sanitize para evitar NoSQL Injections
app.use(mongoSanitize());

// Criando headers de seguranca
app.use(helmet());

// Previnindo ataques Cross Site Scripting (XSS)
app.use(xss());

// Limitar requests a nossa API
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutos
	max: 5
});
app.use(limiter);

// Previnindo poluicao de parametros http
app.use(hpp());

// Criar uma pasta estatica para armazenar as imagens

app.use(express.static(path.join(__dirname, 'public')));

// Arquivos de ROTAS
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');
const users = require('./routes/users');
// CRUD de USERS apenas pros Admins
const usersAuth = require('./routes/usersAuth');

// Mount Rotas
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/auth', auth);
// CRUD de USERS apenas pros Admins
app.use('/api/v1/auth/users', usersAuth);
// Rotas de Users para pessoas comuns (ex: pessoa que quer ver cursos de um instrutor)
app.use('/api/v1/users', users);
app.use(errorhandler);

const server = app.listen(PORT, () => {
	console.log(`Server running in ${nodeEnv} mode on port ${port}.`.yellow.bold);
});
// Handle unhandled promise Rejections

process.on('unhandledrejection', (err, promise) => {
	console.log(`Unhandled Rejection: ${err.message}`);
	// Fechar o servidor e matar a aplicação
	server.close(() => process.exit(1));
});
