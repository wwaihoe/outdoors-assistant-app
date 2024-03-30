const Pool = require('pg').Pool;

// Create a new pool using the connection details of your database  
// PLEASE CHANGE THIS TO YOUR OWN DATABASE CONNECTION DETAILS //

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "postgresdb",
    port: 5432,
    database : "outdoors-assistant"
});

module.exports = pool;