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

/**
 * GET /genres/:id
 * Get a genre by ID.
 * @name getGenreById
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
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
 * @name getDirectorById
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
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
 * @name loginUser
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
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
 * @name createMovie
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
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
 * @name getMovieById
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
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
 * @name deleteMovieById
 * @function
 * @memberof module:express
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
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
 * @name startServer
 * @function
 * @memberof module:express
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
