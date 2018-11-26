//all mobile agent functions (i.e. updating user transactions) are handled through this route.

var express = require('express');
var router = express.Router();
var mysql = require("mysql");




const req = {body:                                                                                                                    [                                                                                                                                     { transaction_id: 4,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 5,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 1200,                                                                                                           agent_Id: '1' },                                                                                                      { transaction_id: 6,                                                                                                      account_no: 222,                                                                                                        credit: 1,                                                                                                              amount: 1200,                                                                                                           agent_Id: '1' },                                                                                                      { transaction_id: 7,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 8,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 9,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 10,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 25,                                                                                                             agent_Id: '1' },                                                                                                      { transaction_id: 11,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 12,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 15,                                                                                                             agent_Id: '1' },                                                                                                      { transaction_id: 13,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 180,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 14,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 180,                                                                                                            agent_Id: '1' } ]};








//DATABASE CONNECTION
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'dbuser',
  password : 'password',
  database : 'database_proj'
});

connection.connect();


/* post transaction sync - agent id hardcoded for now*/
router.post('/', function(req, res, next) {
  console.log(req.body);
  for (var trx in req.body){
    processTransaction(trx);
  }
  res.send('respond with a resource');
});

module.exports = router;


function processTransaction(trx, agent){
  console.log(trx.credit);
  if (trx.credit==1){
    console.log(trx.credit);
    connection.query('call procedure withdraw(?,?,?);', [trx.account_no, trx.amount, 'agent'+trx.agent_Id], function (err, rows, fields) {
      if (err) throw err
      console.log('RECORD ADDED');
    });
  }
  else{
    connection.query('call procedure deposit(?,?,?);', [trx.account_no, trx.amount, 'agent'+trx.agent_Id], function (err, rows, fields) {
      if (err) throw err
      console.log('RECORD ADDED');
    });
  }
};
console.log(req.body[0])
processTransaction(req.body[0]);