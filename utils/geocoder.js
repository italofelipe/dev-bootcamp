const NodeGeocoder = require("node-geocoder");
const { geocoderProvider, geocoderApiKey } = require("../config/config");

const options = {
	provider: geocoderProvider,
	httpAdapter: "https",
	apiKey: geocoderApiKey,
	formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
