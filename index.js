/**
 * @namespace Routes
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
 * @memberOf Routes
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
 * @memberOf Routes
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
 * @memberOf Routes
 */
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

/**
 * Set up authentication.
 * @memberOf Routes
 */
require('./auth')(app);

/**
 * Define routes.
 * @memberOf Routes
 */

/**
 * GET /
 * Welcome message.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

/**
 * GET /movies
 * Get all movies.
 * @function
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

/**
 * GET /genres/:id
 * Get a genre by ID.
 * @function
 * @memberOf Routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.id - The ID of the genre to retrieve.
 */
app.get('/genres/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const genreId = req.params.id;
    const genre = await Genre.findById(genreId);
    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    res.json(genre);
  } catch (error) {
    console.error('Error fetching genre:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /directors/:id
 * Get a director by ID.
 * @function
 * @memberOf Routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.id - The ID of the director to retrieve.
 */
app.get('/directors/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const directorId = req.params.id;
    const director = await Director.findById(directorId);
    if (!director) {
      return res.status(404).json({ error: 'Director not found' });
    }
    res.json(director);
  } catch (error) {
    console.error('Error fetching director:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /movies/login
 * Login user.
 * @function
 * @memberOf Routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.body.username - The username for login.
 * @param {string} req.body.password - The password for login.
 */
app.post('/movies/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ Username: username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /movies
 * Create a new movie.
 * @function
 * @memberOf Routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Object} req.body - The movie data.
 */
app.post('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  const movieData = req.body;
  Movie.create(movieData)
    .then(movie => {
      res.json(movie);
    })
    .catch(error => {
      console.error('Error creating movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

/**
 * GET /movies/:movieId
 * Get a movie by ID.
 * @function
 * @memberOf Routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.movieId - The ID of the movie to retrieve.
 */
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const movieId = req.params.movieId;
  Movie.findById(movieId)
    .then(movie => {
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
    })
    .catch(error => {
      console.error('Error fetching movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

/**
 * DELETE /movies/:movieId
 * Delete a movie by ID.
 * @function
 * @memberOf Routes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.movieId - The ID of the movie to delete.
 */
app.delete('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const movieId = req.params.movieId;
  Movie.findByIdAndRemove(movieId)
    .then(() => {
      res.json({ message: 'Movie deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Define other routes as needed...

/**
 * Start the server.
 * @function
 * @memberOf Routes
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
 console.log('Listening on Port ' + port);
});
