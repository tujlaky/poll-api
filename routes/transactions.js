const express = require('express');
const router = express.Router();
const db = require('../db');

const { validate } = require('express-validation');

const { transactionValidation } = require('../validators/transaction');

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM transactions WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  return res.json(result.rows[0]);
});

router.get('/', async (req, res, next) => {
  const result = await db.query('SELECT * FROM transactions ORDER BY completed ASC');
  const totals = await db.query('SELECT count(*) AS count, sum(amount) AS sum FROM transactions');

  return res.json({
    items: result.rows,
    count: parseInt(totals.rows[0].count),
    total: totals.rows[0].sum
  });
});

router.post('/', validate(transactionValidation, {statusCode: 422}, {}), async (req, res, next) => {
  const query = 'INSERT INTO transactions (name, description, amount, vat, completed) VALUES ($1, $2, $3, $4, now())';

  const values = [
    req.body.name,
    req.body.description,
    req.body.amount,
    req.body.vat
  ];

  const result = await db.query(query, values);

  return res.status(201).end();
});

router.patch('/:id', validate(transactionValidation, {statusCode: 422}, {}), async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM transactions WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  const query = 'UPDATE transactions SET name=$1, description=$2, amount=$3, vat=$4 WHERE id=$5';

  const values = [
    req.body.name,
    req.body.description,
    req.body.amount,
    req.body.vat,
    id
  ];

  await db.query(query, values);

  return res.status(204).end();
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM transactions WHERE id=$1', [id]);

  if (!result || !result.rows || !result.rows[0]) {
    return res.status(404).end();
  }

  await db.query('DELETE FROM transactions WHERE id=$1', [id]);

  return res.status(204).end();
});


module.exports = router;
