const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.route");

const router = express.Router();

const defaultRoutes = [
	{
		path: "/auth",
		route: authRoute,
	},
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
