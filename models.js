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
let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

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
