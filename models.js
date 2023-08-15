const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create a schema for the Movies collection
const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'genre'
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'director'
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
  birthday: Date, // Update the field name to 'birthday'
  favoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});


// Create models using the defined schemas
const Movie = mongoose.model('movie', movieSchema);
const Director = mongoose.model('director', directorSchema);
const Genre = mongoose.model('genre', genreSchema);
const User = mongoose.model('user', userSchema);





module.exports = {
  Movie,
  Director,
  Genre,
  User
};
