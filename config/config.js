// Arquivo feito para substituir o .env, que nao estava funcionando corretamente. As variaveis do .env
// só funcionavam no arquivo server.js, entao caso eu quisesse ter acesso àquelas variaveis em outro
// arquivo, eu nao conseguia.

const configs = {
	nodeEnv: "development",
	port: 5000,
	mongodbURI:
		"mongodb+srv://italofelipe:3672120Felipe*@cluster0-3kwlg.mongodb.net/test?retryWrites=true&w=majority",
	geocoderProvider: "mapquest",
	geocoderApiKey: "xkdjBPfwFv8hqNkz0L7AzlJ9rhPhoeIF"
};
module.exports = configs;
