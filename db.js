const { types, Pool } = require('pg');

types.setTypeParser(types.builtins.NUMERIC, value => {
    return parseFloat(value);
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
