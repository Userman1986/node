const mongoose = require('mongoose');

// Create a schema for the Movies collection
const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  },
  imageURL: String,
  featured: Boolean
});

// Create a schema for the Directors collection
const directorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  birthYear: Number,
  deathYear: Number
});

// Create a schema for the Genres collection
const genreSchema = new mongoose.Schema({
  name: String,
  description: String
});

// Create a schema for the Users collection
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  dateOfBirth: Date,
  favoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

// Create models using the defined schemas
const Movie = mongoose.model('Movie', movieSchema);
const Director = mongoose.model('Director', directorSchema);
const Genre = mongoose.model('Genre', genreSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Movie,
  Director,
  Genre,
  User
};
