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

// Create a schema for the Users collection
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  favoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

// Create models using the defined schemas
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// Export the models for use in other files
module.exports = {
  Movie,
  User
};

