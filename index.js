const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
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

mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

app.get('/movies', (req, res) => {
  Movie.find()
    .then(movies => {
      res.json(movies);
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/movies/genre/:name', (req, res) => {
  const genreName = req.params.name;

  Genre.findOne({ name: genreName })
    .then(genre => {
      if (!genre) {
        // Genre not found
        return res.status(404).json({ error: 'Genre not found' });
      }

      Movie.find({ genre: genre._id })
        .then(movies => {
          res.json(movies);
        })
        .catch(error => {
          console.error('Error fetching movies:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    })
    .catch(error => {
      console.error('Error fetching genre:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



app.post('/movies', (req, res) => {
  res.send('Create a new movie');
});

app.get('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  res.send(`Get details of movie with ID ${movieId}`);
});

app.delete('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;
  res.send(`Delete movie with ID ${movieId}`);
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
