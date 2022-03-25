const express = require('express');
const router = express.Router();
const db = require('../db');

const { validate } = require('express-validation');

const { answerValidation } = require('../validators/answer');

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM answer WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  return res.json(result.rows[0]);
});

router.get('/', async (req, res, next) => {
  const result = await db.query('SELECT * FROM answer ORDER BY completed ASC');

  return result.rows;
});

router.post('/', validate(transactionValidation, {statusCode: 422}, {}), async (req, res, next) => {
  const query = 'INSERT INTO answer (title, poll_id, created_at) VALUES ($1, $2, now())';

  const values = [
    req.body.title,
    req.body.poll_id,
  ];

  const result = await db.query(query, values);

  return res.status(201).end();
});

router.patch('/:id', validate(transactionValidation, {statusCode: 422}, {}), async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM answer WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  const query = 'UPDATE answer SET title=$1 WHERE id=$2';

  const values = [
    req.body.title,
    id
  ];

  await db.query(query, values);

  return res.status(204).end();
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM answer WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  await db.query('DELETE FROM answer WHERE id=$1', [id]);

  return res.status(204).end();
});


module.exports = router;
