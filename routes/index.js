//all admin related functions such as creating new accounts are stored in this file.

var express = require('express');
var router = express.Router();
var mysql = require("mysql");

//DATABASE CONNECTION
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'dbuser',
  password : 'password',
  database : 'database_proj'
});

connection.connect();


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});




//get create account page
router.get('/createAccount', function(req, res, next) {
  res.render('createAccount', { title: 'Create New Account' });
});


//handle account creation
router.post('/createAccount', function(req, res, next){
  //const x = req.body.username;
  var newAcc = {owner_id: req.body.owner_id, type_id: req.body.type_id, account_no: req.body.account_no, balance: req.body.balance, agent_id: req.body.agent_id, password: req.body.password};
  console.log(req.body);

  connection.query('INSERT INTO account VALUES("'+newAcc.type_id+'", '+newAcc.account_no+', '+newAcc.balance+',  NOW(), "'+newAcc.owner_id+'", "'+newAcc.agent_id+'", "'+newAcc.password+'");', function (err, rows, fields) {
    if (err) throw err

    console.log('RECORD ADDED')
  });

  //console.log(x);
  res.render('accountCreated',  { title: 'Account Created' });
});


//run random sql query
router.get('/sqlquery', function(req, res, next) {
  
  
  connection.query('INSERT INTO customer VALUES ("haritha", "jayasinghe", "96224034594", "male", NOW(), "4545C4545", 33, "dsdsdsds", 02323239)', function (err, rows, fields) {
    if (err) throw err

    console.log('RECORD ADDED')
});

});

module.exports = router;
