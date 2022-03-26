const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const { ValidationError } = require('express-validation');

const indexRouter = require('./routes/index');
const pollRouter = require('./routes/poll');
const answerRouter = require('./routes/answer');
const voteRouter = require('./routes/vote');

const app = express();

require('./db');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

try {
  app.use('/', indexRouter);
  app.use('/doc', express.static('public'));
  app.use('/poll', pollRouter);
  app.use('/answer', answerRouter);
  app.use('/vote', voteRouter);
} catch(err) {
  return res.status(500).json(err);
}

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

module.exports = app;
