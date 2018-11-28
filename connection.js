var mysql = require("mysql");
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'dbuser',
    password : 'password',
    database : 'database_proj'
  })
connection.connect();
module.exports = connection;