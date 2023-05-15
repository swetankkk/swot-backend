const express = require('express');
const cors = require('cors');
const routes = require('./routes/v1');

const app = express();

//parse json requrest body
app.use(express.json());
//parse url encoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

/*app.use(passport.initialize());
passport.use(
	"jwt",
	new JwtStrategy(jwtOptions, (jwt_payload, done) => {
		User.findById(jwt_payload.id)
			.then((user) => {
				if (user) {
					return done(null, user);
				}
				return done(null, false);
			})
			.catch((err) => {
				console.log(err);
				return done(err, false);
			});
	})
);
passport.use(
	"local",
	new LocalStrategy(localOptions, (username, password, done) => {
		User.findOne({ username }).then((user) => {
			if (!user) {
				return done(null, false);
			}
			user
				.comparePassword(password, (err, isMatch) => {
					if (err) {
						return done(err);
					}
					if (!isMatch) {
						return done(null, false);
					}
					return done(null, user);
				})
				.catch((err) => {
					console.log(err);
					return done(err, false);
				});
		});
	}).catch((err) => {
		console.log(err);
		return done(err, false);
	})
);
*/

app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
