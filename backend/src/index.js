const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
const dbConnect = require('./db/db');
const userRoutes = require('./routes/user.routes');

app.use(cors());
app.use(express.json());
dbConnect();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRoutes);

module.exports = app;