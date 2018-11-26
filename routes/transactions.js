//all mobile agent functions (i.e. updating user transactions) are handled through this route.

var express = require('express');
var router = express.Router();
var mysql = require("mysql");




const req1 = {body:                                                                                                                    [                                                                                                                                     { transaction_id: 4,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 5,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 1200,                                                                                                           agent_Id: '1' },                                                                                                      { transaction_id: 6,                                                                                                      account_no: 222,                                                                                                        credit: 1,                                                                                                              amount: 1200,                                                                                                           agent_Id: '1' },                                                                                                      { transaction_id: 7,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 8,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 9,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 10,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 25,                                                                                                             agent_Id: '1' },                                                                                                      { transaction_id: 11,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 12,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 15,                                                                                                             agent_Id: '1' },                                                                                                      { transaction_id: 13,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 180,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 14,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 180,                                                                                                            agent_Id: '1' } ]};








//DATABASE CONNECTION
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'dbuser',
  password : 'password',
  database : 'database_proj'
});

connection.connect();


/* post transaction sync */
router.post('/', function(req, res, next) {
  console.log(req.body);
  console.log(req);
  for (var i=0;  i<req.body.length; i++){
    processTransaction(req.body[i]);
  }
    rows = getAccountBalances("agent"+req.body[0].agent_Id);
    rowsJSON = JSON.stringify(rows);
    console.log(rowsJSON);
    res.status(500).json(rowsJSON);
});


//handle special transactions
//todo: extra query into relevant mobile agent
router.post('/special', function(req, res, next) {
  console.log(req.body[0]);
  connection.query('select checkBalance(?,?);', [req.body[0].account_no, req.body[0].amount], function(err, rows, fields){
    if (err) throw err
    console.log(rows[0][fields[0].name])
    if (rows[0][fields[0].name] == 1){
      connection.query('call specialWithdraw(?,?,?);', [req.body[0].account_no, req.body[0].amount, "agent"+req.body[0].agent_Id], function(err, rows, fields) {
        if (err) throw err
        console.log('special transaction processed');
      });
    } else{
      res.send('error')
    }
  })
    
    
  })
  connection.query('call specialWithdraw(?,?,?);', [req.body[0].account_no, req.body[0].amount, "agent"+req.body[0].agent_Id], function(err, rows, fields) {
    if (err) throw err
    console.log('special transaction processed');
  });
  res.send('respond with a resource');
});

module.exports = router;


function processTransaction(trx){
  console.log(trx.credit, trx.account_no, trx.amount, trx.agent_Id);
  if (trx.credit==1){
    
    connection.query('call withdraw(?,?,?);', [trx.account_no, trx.amount, "agent"+trx.agent_Id], function (err, rows, fields) {
      if (err) throw err
      console.log('RECORD ADDED');
    });
  }
  else{
    connection.query('call deposit(?,?,?);', [trx.account_no, trx.amount, 'agent'+trx.agent_Id], function (err, rows, fields) {
      if (err) throw err
      console.log('RECORD ADDED');
    });
  }
};


function getAccountBalances(agent){
  connection.query('select account_no, balance from account where agent_id=?;', [agent], function (err, rows, fields){
    if (err) throw err
    console.log(rows);
    return rows;
  });
}


//test codes

//getAccountBalances('agent1');

//processTransaction(req.body[0]);

/* console.log(req1.body[0]);
connection.query('call specialWithdraw(?,?,?);', [req1.body[0].account_no, req1.body[0].amount, "agent"+req1.body[0].agent_Id], function(err, rows, fields) {
  if (err) throw err
  console.log('speciall transaction processed');
}); */


connection.query('select checkBalance(?,?);', [req1.body[0].account_no, req1.body[0].amount], function(err, rows, fields){
  if (err) throw err
  console.log(rows[0][fields[0].name])
  if (rows[0][fields[0].name] == 1){
    connection.query('call specialWithdraw(?,?,?);', [req1.body[0].account_no, req1.body[0].amount, "agent"+req1.body[0].agent_Id], function(err, rows, fields) {
      if (err) throw err
      console.log('special transaction processed');
    });
  }
})