const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Please, add a name' ]
	},
	email: {
		type: String,
		required: [ true, 'Please add a valid email address' ],
		unique: true,
		match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
	},
	role: {
		type: String,
		enum: [ 'user', 'publisher', 'admin' ],
		default: 'user'
	},
	password: {
		type: String,
		required: [ true, 'Please add a password' ],
		minlength: 6,
		select: false
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Criptografar senhas usando Bcrypt
UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Passar um JWT a um usuario
UserSchema.methods.getSignedJwtToken = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	});
};

// Verificar se a senha inserida combina com a senha criptografada no banco
UserSchema.methods.matchPassword = async function(enteredPassword) {
	/* Esse metodo do bcrypt recebe 2 params: o primeiro e o que queremos 
		comprar, e o segundo e com o que queremos comparar, logo, com a senha no DB
	*/
	return await bcrypt.compare(enteredPassword, this.password);
	/* this.password aponta para o password
		passado no middleware em auth.js
	*/
};

// Gerar e fazer o hash do token da senha
UserSchema.methods.getResetPasswordToken = function() {
	// Gerar o token
	const resetToken = crypto.randomBytes(20).toString('hex');
	// Fazer o Hash do Token e atribui-lo ao campo resetPasswordToken
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// Definir uma data para o token expirar para 10 minutos

	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
