const express = require('express');
const { authGetUsers, authGetUser, createUser, updateUser, deleteUser } = require('../controllers/usersController');
const User = require('../models/User');

const { protect, authorize } = require('../middlewares/auth');
const customResults = require('../middlewares/customResults');

const router = express.Router();
router.use(protect);
router.use(authorize('admin'));
/* Tudo abaixo dessa linha router.use(protect); ja vira com o protect embutido, sem necessidade
de colocarmos em todas as rotas */

// Rotas restritas aos admins da aplicacao
router.route('/').get(customResults(User), authGetUsers).post(createUser);
router.route('/:id').get(authGetUser).put(updateUser).delete(deleteUser);
module.exports = router;
