const express = require('express');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviewsController');
const { protect, authorize } = require('../middlewares/auth');

const Review = require('../models/Review');
const customResults = require('../middlewares/customResults');
/*  Esse objeto com mergeParams é necessário por conta do relacionamento com bootcamps
 *   A rota para obter os cursos provém dos Bootcamps (ver arquivo bootcamps, nessa mesma pasta)
 */
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		customResults(Review, {
			path: 'bootcamp',
			select: 'name description'
		}),
		getReviews
	).post(protect, authorize('user', 'admin'), addReview) 
	// So quem pode fazer reviews sao usuarios comuns ou admin, publishers nao podem fazer reviews
  
  router.route('/:id').get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(deleteReview)
module.exports = router;
