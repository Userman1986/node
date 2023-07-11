const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { Movie, Genre, Director, User } = require('./models');

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

app.get('/movies/:movieId', (req, res) => {
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

app.delete('/movies/:movieId', (req, res) => {
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

app.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.post('/users', (req, res) => {
  const userData = req.body;
  User.create(userData)
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;
  User.findByIdAndUpdate(userId, updatedUserData, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    })
    .catch(error => {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  User.findByIdAndRemove(userId)
    .then(() => {
      res.json({ message: 'User deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

const port = 27017;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
