// routes/invoices.js

const express = require('express');
const db = require('../db');
const ExpressError = require('../expressError');

const router = express.Router();

// GET /invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, comp_code FROM invoices');
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(new ExpressError('Error fetching invoices', 500));
  }
});

// GET /invoices/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return next(new ExpressError(`Invoice with ID ${id} not found`, 404));
    }

    const invoice = result.rows[0];
    const companyResult = await db.query('SELECT * FROM companies WHERE code = $1', [invoice.comp_code]);
    const company = companyResult.rows[0];

    return res.json({ invoice: { ...invoice, company } });
  } catch (err) {
    return next(new ExpressError('Error fetching invoice', 500));
  }
});

// POST /invoices
router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const result = await db.query(
      'INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date',
      [comp_code, amt]
    );

    return res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    return next(new ExpressError('Error creating invoice', 500));
  }
});

// PUT /invoices/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt } = req.body;

    const result = await db.query(
      'UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING id, comp_code, amt, paid, add_date, paid_date',
      [amt, id]
    );

    if (result.rows.length === 0) {
      return next(new ExpressError(`Invoice with ID ${id} not found`, 404));
    }

    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(new ExpressError('Error updating invoice', 500));
  }
});

// DELETE /invoices/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM invoices WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return next(new ExpressError(`Invoice with ID ${id} not found`, 404));
    }

    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(new ExpressError('Error deleting invoice', 500));
  }
});

module.exports = router;
