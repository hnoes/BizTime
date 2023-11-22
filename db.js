/** Database setup for BizTime. */

const { Pool } = require('pg');

const pool = new Pool({
    user: 'hilarienoes',
    host: 'localhost',
    database: 'biztime',
    password: 'Ae_1324agd!6pg'
});

module.exports = {
    queryy: (text, params) => pool.query(text, params),
}; 
