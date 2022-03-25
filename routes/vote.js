const express = require('express');
const router = express.Router();
const db = require('../db');

const { validate } = require('express-validation');

const { voteValidation } = require('../validators/vote');

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM vote WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  return res.json(result.rows[0]);
});

router.get('/', async (req, res, next) => {
  const result = await db.query('SELECT * FROM vote ORDER BY created_at ASC');

  return result.rows;
});

router.post('/', validate(voteValidation, {statusCode: 422}, {}), async (req, res, next) => {
  const answerId = req.params.answer_id;
  const answerResult = await db.query('SELECT * FROM answer WHERE id=$1', [answerId]);
  const query = 'INSERT INTO vote (username, poll_id, answer_id, created_at) VALUES ($1, $2, $3, now())';

  if (!answerResult || !answerResult.rows || !answerResult.rows[0]) {
    return res.status(404).end();
  }

  const answer = answerResult.rows[0];

  const values = [
    req.body.username,
    answer.poll_id,
    req.body.answer_id,
  ];

  const result = await db.query(query, values);

  return res.status(201).end();
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM vote WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  await db.query('DELETE FROM vote WHERE id=$1', [id]);

  return res.status(204).end();
});


module.exports = router;
