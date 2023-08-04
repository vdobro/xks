(function (window) {
	window["env"] = window["env"] || {};

	// Environment variables
	window["env"]["apiUrl"] = "${API_URL}";
	window["env"]["dbUrl"] = "${EXTERNAL_COUCHDB_URL}";
})(this);
