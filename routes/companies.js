// routes/companies.js

const express = require('express');
const slugify = require('slugify'); // import the slugify library 
const db = require('../db');
const ExpressError = require('../expressError');

const router = express.Router();

// GET /companies
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, name FROM companies');
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(new ExpressError('Error fetching companies', 500));
  }
});

// GET /companies/:code
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);

    if (result.rows.length === 0) {
      return next(new ExpressError(`Company with code ${code} not found`, 404));
    }

    const company = result.rows[0];

    // fetch invoices for the company
    const invoicesResult = await db.query('SELECT id FROM invoices WHERE comp_code = $1', [code]); 
    const invoices = invoicesResult.rows.map((invoice) => invoice.id);

    return res.json({ company: {...company, invoices } });
  } catch (err) {
    return next(new ExpressError('Error fetching company', 500));
  }
});

// POST /companies
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // generate a code using slugify 
    const codeGenerated = slugify(name, { lower: true });

    const result = await db.query(
      'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
      [code, name, description]
    );

    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    return next(new ExpressError('Error creating company', 500));
  }
});

// PUT /companies/:code
router.put('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;

    const result = await db.query(
      'UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description',
      [name, description, code]
    );

    if (result.rows.length === 0) {
      return next(new ExpressError(`Company with code ${code} not found`, 404));
    }

    return res.json({ company: result.rows[0] });
  } catch (err) {
    return next(new ExpressError('Error updating company', 500));
  }
});

// DELETE /companies/:code
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query('DELETE FROM companies WHERE code = $1 RETURNING code', [code]);

    if (result.rows.length === 0) {
      return next(new ExpressError(`Company with code ${code} not found`, 404));
    }

    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(new ExpressError('Error deleting company', 500));
  }
});

module.exports = router;
