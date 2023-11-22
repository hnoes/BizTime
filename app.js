/** BizTime express application. */

const express = require('express');
const { Pool } = require('pg');
const ExpressError = require("./expressError");
const companiesRoutes = require('./routes/companies');

// other imports 

const app = express();
const PORT = process.env.PORT || 3000;

// database connection setup
const pool = new Pool({
  user: 'hilarienoes',
  host: 'localhost',
  database: 'biztime',
  password: 'Ae_1324agd!6pg',
  port: 5432,
});

app.use(express.json());

// mount the companiesRoutes under the /companies path
app.use('/companies', companiesRoutes); 

// other routes and middleware 

/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

module.exports = app;
