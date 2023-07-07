const express = require('express');
const app = express();
const morgan = require('morgan');
const { Movie, Genre, Director, User } = require('./models');

const movies = [
  {
    title: 'Movie 1',
    description: 'This is Movie 1',
    genre: 'Action',
    director: 'Director 1',
    imageURL: 'https://*'
  },
  {
    title: 'Movie 2',
    description: 'This is Movie 2',
    genre: 'Comedy',
    director: 'Director 2',
    imageURL: 'https://*'
  },
  // Add more movies
];

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.post('/movies', (req, res) => {
  const newMovie = req.body;
  movies.push(newMovie);
  res.json(newMovie);
});

app.get('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  const movie = movies.find(movie => movie.id === movieId);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.delete('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  const index = movies.findIndex(movie => movie.id === movieId);
  if (index !== -1) {
    const deletedMovie = movies.splice(index, 1);
    res.json({ message: 'Movie deleted successfully', movie: deletedMovie[0] });
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.get('/users', (req, res) => {
  res.send('Get all users');
});

app.post('/users', (req, res) => {
  res.send('Create a new user');
});

app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Get details of user with ID ${userId}`);
});

app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Update details of user with ID ${userId}`);
});

app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Delete user with ID ${userId}`);
});

const port = 27017;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
