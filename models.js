const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

const directorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  birthYear: { type: Number, required: true },
  deathYear: { type: Number }
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
  director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director', required: true },
  imageURL: { type: String }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

const Genre = mongoose.model('Genre', genreSchema);
const Director = mongoose.model('Director', directorSchema);
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Movie, Genre, Director, User };
