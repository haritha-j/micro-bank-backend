var express = require('express');
var router = express.Router();
var mysql = require("mysql");

//DATABASE CONNECTION
 var connection = mysql.createConnection({
  host : 'localhost',
  user : 'manager',
  password : 'manager@123',
  database : 'database_proj'
});

connection.connect();


/* GET accountReport page. */
router.get('/', function(req, res, next) {

    res.render('accountreport', { title: 'Bank report' });
  
  
      });
    



router.get('/acc_wise_report', function(req, res, next) {
  res.render('acc_wise_report', { title: 'account wise report' });
    
});


module.exports = router;