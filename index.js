const express = require('express');
const app = express();
const morgan = require('morgan');

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
  // Фвв ьщку ьщмшуы
];


// Get the list of all movies
app.get('/movies', (req, res) => {
  res.send('Get all movies');
});

// Create a new movie
app.post('/movies', (req, res) => {
  res.send('Create a new movie');
});

// Get details of a specific movie
app.get('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  res.send(`Get details of movie with ID ${movieId}`);
});

// Update details of a specific movie
app.put('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  res.send(`Update details of movie with ID ${movieId}`);
});

// Delete a specific movie
app.delete('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  res.send(`Delete movie with ID ${movieId}`);
});

// Get the list of all users
app.get('/users', (req, res) => {
  res.send('Get all users');
});

// Create a new user
app.post('/users', (req, res) => {
  res.send('Create a new user');
});

// Get details of a specific user
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Get details of user with ID ${userId}`);
});

// Update details of a specific user
app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Update details of user with ID ${userId}`);
});

// Delete a specific user
app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Delete user with ID ${userId}`);
});


app.use(express.static('public'));
app.use(morgan('dev'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

const port = 1800;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



