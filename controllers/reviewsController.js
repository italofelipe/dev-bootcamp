const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

/* Desc: Obter todos os Reviews
  *  ROTA: GET /api/v1/reviews
  *  ROTA: GET /api/v1/bootcamps/:bootcampId/reviews
  *  ACESSO: Public
 */

exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });
		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews
		});
	} else {
		res.status(200).json(res.customResults);
	}
});

/* Desc: Obter um unico Review
  *  ROTA: GET /api/v1/reviews/:id
  *  ACESSO: Public
 */

exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await (await Review.findById(req.params.id)).populate({
		path: 'bootcamp',
		select: 'name description'
	});
	if (!review) {
		return next(new ErrorResponse(`No review found with the id of ${req.params.id}`), 404);
	}
	res.status(200).json({ success: true, data: review });
});


/* Desc: Adicionar um review
  *  ROTA: POST /api/v1/:bootcampId/reviews
  *  ACESSO: Private
 */

exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId
	req.body.user = req.user.id

	const bootcamp = await Bootcamp.findById(req.params.bootcampId)
	if(!bootcamp) {
		return next(new ErrorResponse(`No bootcamp found with the ID of ${req.params.bootcampId}`), 404)
	}
	const review = await Review.create(req.body)
	res.status(201).json({ success: true, data: review });
});


/* Desc: Editar um review
  *  ROTA: PUT /api/v1/reviews/:id
  *  ACESSO: Private
 */

exports.updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id)
	if(!review) {
		return next(new ErrorResponse(`No review with the ID of ${req.params.id}`), 404)
	}

	// Verificar se o usuario tem permissao para editar um review (se e ou nao o dono daquele review)
	if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`Not authorized to update this review`), 401)
	}
	review = await Review.findByIdAndUpdate(req.params.id, req.body, { 
		new: true,
		runValidators: true
	})
	res.status(200).json({ success: true, data: review });
});




/* Desc: Deletar um review
  *  ROTA: DELETE /api/v1/reviews/:id
  *  ACESSO: Private
 */

exports.deleteReview = asyncHandler(async (req, res, next) => {

	const review = await Review.findByIdAndDelete(req.params.id)
	if(!review) {
		return next(new ErrorResponse(`No bootcamp found with the ID of ${req.params.id}`), 404)
	}
	res.status(200).json({ success: true, data: {} });
});
