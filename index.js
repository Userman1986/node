const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { Movie, Genre, Director, User } = require('./models');
const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('./models');





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://esamonin1986:<password>@mymovieapi.lxey35j.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);









mongoose.connect('mongodb+srv://esamonin1986:greenfly@mymovieapi.lxey35j.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

require('./auth')(app);
const cors = require('cors');

let allowedOrigins = ['http://localhost:3000', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));



app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movie.find()
    .then(movies => {
      res.json(movies);
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.post('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.delete('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
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


app.post('/users', async (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
      //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.get('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.put('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.delete('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.post('/users', async (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
      //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
