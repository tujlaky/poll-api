const express = require('express');
const router = express.Router();
const db = require('../db');

const { validate } = require('express-validation');

const { answerValidation } = require('../validators/answer');

router.get('/', async (req, res, next) => {
  const result = await db.query('SELECT * FROM answer ORDER BY created_at ASC');

  return result.rows;
});


module.exports = router;
