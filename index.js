/**
 * Require necessary modules.
 * @module express
 * @module mongoose
 * @module passport
 * @module cors
 */
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Movie, Genre, Director, User } = require('./models');
const passport = require('passport');

/**
 * Connect to MongoDB database.
 * @function
 * @name mongoose.connect
 * @param {string} URI - MongoDB connection URI.
 * @param {object} options - Connection options.
 * @returns {Promise<void>}
 */
mongoose.connect('mongodb+srv://esamonin1986:greenfly@mymovieapi.lxey35j.mongodb.net/MyMovieApi?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

/**
 * Configure CORS.
 * @function
 * @name app.use
 * @param {function} middleware - Middleware function for CORS.
 */
const cors = require('cors');
let allowedOrigins = ['http://localhost:1234', 'http://testsite.com', 'https://userman1986.github.io', 'https://guarded-hamlet-46049-f301c8b926bd.herokuapp.com', 'https://myflixappfromevhenii.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = "The CORS policy for this application doesn't allow access from origin " + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

/**
 * Set up middleware.
 * @function
 * @name app.use
 * @param {function} middleware - Middleware function for logging and parsing JSON.
 */
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

/**
 * Set up authentication.
 * @function
 * @name require
 */
require('./auth')(app);

/**
 * Define routes.
 */

/**
 * GET /
 * Welcome message.
 * @name getWelcomeMessage
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

/**
 * GET /movies
 * Get all movies.
 * @name getMovies
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/movies', (req, res) => {
  Movie.find()
    .populate('genre director')
    .then((movies) => {
      res.json(movies);
    })
    .catch((error) => {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Define other routes with appropriate JSDoc tags...

/**
 * Start the server.
 * @name startServer
 * @function
 * @memberof module:express
 * @param {number} port - Port number for the server.
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
