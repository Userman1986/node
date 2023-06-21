const express = require('express');

app.use(express.static('public'));
const app = express();

app.get('/movies', (req, res) => {
    const movies = [
      { title: 'Movie 1', rating: 9 },
      { title: 'Movie 2', rating: 9 },
      // Add more movie objects as needed
    ];
    res.json(movies);
  });
  
  app.get('/', (req, res) => {
    res.send('Welcome to my movie API!');
  });
  





  const port = 1800;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
