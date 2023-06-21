const express = require('express');
const app = express();
const morgan = require('morgan');

const movies = [
  { title: 'Movie 1', rating: 8 },
  { title: 'Movie 2', rating: 7 },
  // Add more movie 
];

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
