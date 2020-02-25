const customResults = (model, populate) => async (req, res, next) => {
	let query;
	// Req.query é como o Express trata o que é passado como Query String
	const reqQuery = { ...req.query };

	if (req.params.bootcampId) {
		reqQuery.bootcamp = req.params.bootcampId;
	}

	// Filtrar somente pelos campos que pedimos na requisição
	const removeFields = [ 'select', 'sort', 'page', 'limit' ];

	// Loop pelo removeFields e tirá-los de nossa query
	removeFields.forEach((param) => delete reqQuery[param]);
	console.log(reqQuery);

	// Criar Query String
	let queryStr = JSON.stringify(reqQuery);

	// Criando "operadores" para fazermos buscas avançadas via Query String
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
	console.log(queryStr);

	// Encontrando recurso
	query = model.find(JSON.parse(queryStr));
	// Selecionando campos
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
		console.log(fields);
	}
	// Classificação
	// Caso tenha os dados que eu pedi na requisicao, classificálos (na maneira que eu quiser)
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		// Caso existam os dados, mas minha classificação "nao faça sentido", ordená-los por Data (buscando campo createdAt)
		query = query.sort('-createdAt');
	}

	// Paginação

	// Aqui, estou fazendo o calculo de quantos itens virão por pagina
	const page = parseInt(req.query.page, 10) || 1; // 1 Significa que quero uma página por vez
	const limit = parseInt(req.query.limit, 10) || 25; // 100 Significa que quero que busque até 100 registros
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);
	if (populate) {
		query = query.populate(populate);
	}
	// Executando a query
	const results = await query;

	// Retornando os resultados da paginação junto à resposta (mais facilidade para pegar isso no Front End)
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		};
	}
	res.customResults = {
		success: true,
		count: results.length,
		pagination,
		data: results
	};
	next();
};

module.exports = customResults;
