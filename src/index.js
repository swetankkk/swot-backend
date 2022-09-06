const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
	server = app.listen(config.port, () => {
		console.log(`Server is running on port ${config.port}`);
	});
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			console.log("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (err) => {
	console.log(err);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	console.log("SIGTERM signal received.");
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}
});

process.on("SIGINT", function () {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	// some other closing procedures go here
	process.exit(0);
});

module.exports = app;
