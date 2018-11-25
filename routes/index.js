//all admin related functions such as creating new accounts are handled in this route.

//todo - check minimum balance depending on account type before creating account
//todo : check age limit for type of account
//todo : add form to add customer to database
//todo : add ability to deactivate account

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


//Create new account

//get create account page
router.get('/createAccount', function(req, res, next) {
  res.render('createAccount', { title: 'Create New Account' });
});



//handle account creation
router.post('/createAccount', function(req, res, next){
  //const x = req.body.username;
  var newAcc = {owner_id: req.body.owner_id, type_id: req.body.type_id, account_no: req.body.account_no, balance: req.body.balance, agent_id: req.body.agent_id, password: req.body.password};
  console.log(req.body);

//check age and min. balance restrictions


/* Begin transaction to add data to db*/
connection.beginTransaction(function(err) {
  if (err) { throw err; }
  connection.query('INSERT INTO account (type_id, account_no, balance, opening_date, agent_id, password) VALUES(?, NULL, ?,  NOW(), ?, ?);',[newAcc.type_id, newAcc.balance, newAcc.agent_id, newAcc.password ], function(err, result) {
    if (err) { 
      connection.rollback(function() {
        console.log(err);
        res.render('invalid');
        //throw err;
      });
    }
    else{
      console.log(result)
    
 //add owner info to database
    connection.query('INSERT INTO owner_info VALUES(?, ?)', [newAcc.owner_id, result.insertId]
    , function(err, result) {
      if (err) { 
        connection.rollback(function() {
          throw err;
        });
      }  
      connection.commit(function(err) {
        if (err) { 
          connection.rollback(function() {
            throw err;
          });
        }
        console.log('Transaction Complete.');
        res.render('accountCreated',  { title: 'Account Created' });
      });
    });
  }
  });
});
/* End transaction */

});


//create new FD account

//get create FD account page
router.get('/createFDAccount', function(req, res, next) {
  res.render('createFDAccount', { title: 'Create New Fixed Deposit Account' });
});


//todo : auto increment account no

//handle FD account creation
router.post('/createFDAccount', function(req, res, next){
  //const x = req.body.username;
  var newAcc = {savings_account_no: req.body.savings_account_no, plan_id: req.body.plan_id, account_no: req.body.account_no, balance: req.body.balance, savings_password: req.body.password};
  console.log(req.body);

  //check if passwords match
  connection.query('SELECT password FROM account WHERE account_no = ?;', [newAcc.savings_account_no], function (err, rows, fields){
    if (err) throw err
    else{
      savingsPass = rows[0].password;
      console.log(savingsPass);
      if (savingsPass == newAcc.savings_password){
        //create new FD record
        connection.query('INSERT INTO FD_account VALUES(NULL, ?,  NOW(), ?, ?);', [newAcc.balance, newAcc.savings_account_no, newAcc.plan_id], function (err, rows, fields) {
          if (err) throw err
      
          console.log('FD RECORD ADDED');
          res.render('accountCreated',  { title: 'Account Created' });
        });

      }
      else{
        console.log("Passwords dont match");
        res.render('accountCreated',  { title: 'Password is incorrect' });
      }
    }
  });

});


//run random sql query
router.get('/sqlquery', function(req, res, next) {
  
  
  connection.query('INSERT INTO customer VALUES ("haritha", "jayasinghe", "96224034594", "male", NOW(), "4545C4545", 33, "dsdsdsds", 02323239)', function (err, rows, fields) {
    if (err) throw err

    console.log('RECORD ADDED')
});

});

module.exports = router;
