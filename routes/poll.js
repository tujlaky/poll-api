const express = require('express');
const router = express.Router();
const db = require('../db');

const { validate } = require('express-validation');

const { pollValidation } = require('../validators/poll');

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM poll WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  return res.json(result.rows[0]);
});

router.get('/:id/answers', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM answer WHERE poll_id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  return res.json(result.rows);
});

router.get('/:id/votes', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT a.id as id, a.title as title, COUNT(v.id) AS vote FROM answer a LEFT JOIN vote v ON (a.id=v.answer_id) WHERE a.poll_id=$1 GROUP BY a.id', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  return res.json(result.rows.map(row => ({
    id: row.id,
    title: row.title,
    count: parseInt(row.vote, 10)
  })));
});


router.get('/', async (req, res, next) => {
  const result = await db.query('SELECT * FROM poll ORDER BY created_at ASC');

  return res.json(result.rows);
});

router.post('/', validate(pollValidation, {statusCode: 422}, {}), async (req, res, next) => {
  const query = 'INSERT INTO poll (title, username, created_at) VALUES ($1, $2, now())';

  const values = [
    req.body.title,
    req.body.username,
  ];

  const result = await db.query(query, values);

  return res.status(201).end();
});

router.patch('/:id', validate(pollValidation, {statusCode: 422}, {}), async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM poll WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  const query = 'UPDATE poll SET title=$1, username=$2 WHERE id=$3';

  const values = [
    req.body.title,
    req.body.username,
    id
  ];

  await db.query(query, values);

  return res.status(204).end();
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM poll WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  await db.query('DELETE FROM poll WHERE id=$1', [id]);

  return res.status(204).end();
});


module.exports = router;
