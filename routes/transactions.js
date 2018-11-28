//all mobile agent functions (i.e. updating user transactions) are handled through this route.

var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var session = require('express-session');



const req1 = {body:                                                                                                                    [                                                                                                                                     { transaction_id: 4,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: 'agent1' },                                                                                                      { transaction_id: 5,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 1200,                                                                                                           agent_Id: '1' },                                                                                                      { transaction_id: 6,                                                                                                      account_no: 222,                                                                                                        credit: 1,                                                                                                              amount: 1200,                                                                                                           agent_Id: '1' },                                                                                                      { transaction_id: 7,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 8,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 9,                                                                                                      account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 10,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 25,                                                                                                             agent_Id: '1' },                                                                                                      { transaction_id: 11,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 100,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 12,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 15,                                                                                                             agent_Id: '1' },                                                                                                      { transaction_id: 13,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 180,                                                                                                            agent_Id: '1' },                                                                                                      { transaction_id: 14,                                                                                                     account_no: 222,                                                                                                        credit: 0,                                                                                                              amount: 180,                                                                                                            agent_Id: '1' } ]};





var connection = mysql.createConnection({
  host : 'localhost',
  user : 'dbuser',
  password : 'password',
  database : 'database_proj'
});

//console.log(connection.user);
connection.connect();

var connectionMan = mysql.createConnection({
  host : 'localhost',
  user : 'manager',
  password : 'manager@123',
  database : 'database_proj'
});

//console.log(connection.user);
connectionMan.connect();
//var userID;
//var userPassword;


//authentication
router.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "agent" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// Login endpoint
router.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send({mes:'login failed'});    
  } else if(req.query.username === "agent" && req.query.password === "agentpassword") {
    req.session.user = "agent";
    req.session.admin = true;
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send({mes:"login success!"});

  }
});
 
// Logout endpoint
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
 
// Get content endpoint
router.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});


router.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});


/* post transaction sync */
router.post('/', function(req, res, next) {
  var userID = 'dbuser';
  var userPassword = 'password'
 
 // console.log(req.body);
  //console.log(req);
  for (var i=0;  i<req.body.length; i++){
    console.log(req.body);
    processTransaction(req.body[i]);
  }
    
  connection.query('select type_id, account_no, balance, opening_date, agent_id, password from account;', function (err, rows, fields){
    if (err) console.log(err)
    //console.log(rows)
    console.log("works");
    //console.log(rowsJSON)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(JSON.stringify(rows));
    //return rowsJSON;
  });
  //console.log(rowsJSON)

  

});


//handle special transactions
//todo: extra query into relevant mobile agent
router.post('/special', function(req, res, next) {
  console.log(req.body[0]);
  connection.query('select checkBalance(?,?);', [req.body[0].account_no, req.body[0].amount], function(err, rows, fields){
    if (err) throw err
    console.log(rows[0][fields[0].name])
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (rows[0][fields[0].name] == 1){
      connection.query('call specialWithdraw(?,?,?);', [req.body[0].account_no, req.body[0].amount, req.body[0].agent_Id], function(err, rows, fields) {
        if (err) throw err
        console.log('special transaction processed');
        rows[0].push({cash_error: false});
        rowsJSON = JSON.stringify(rows[0]);
        
        console.log(rowsJSON)
      res.send(rowsJSON);
      });
    } else{
      res.send([{account_no: 0, 'balance':0}, {cash_error: true}]);
    }
  })
  });


module.exports = router;


function processTransaction(trx){
  console.log(trx)
  if (trx.account_no == undefined){

    console.log("logged in")
  } else{
  console.log(trx.credit, trx.account_no, trx.amount, trx.agent_Id);
  if (trx.credit==1){
    
    connection.query('call withdraw(?,?,?);', [trx.account_no, trx.amount, trx.agent_Id], function (err, rows, fields) {
      if (err) throw err
      console.log('RECORD ADDED');
    });
  }
  
  else{
    connection.query('call deposit(?,?,?);', [trx.account_no, trx.amount, trx.agent_Id], function (err, rows, fields) {
      if (err) throw err
      console.log('RECORD ADDED');
    });
  }
}
};


function getAccountBalances(){
  connection.query('select type_id, account_no, balance, opening_date, agent_id, password from account;', function (err, rows, fields){
    if (err) throw err
    //console.log(rows);
    rowsJSON = JSON.stringify(rows);
    console.log(rowsJSON)
    return rowsJSON;
  });
}


//test codes

//getAccountBalances('agent1');

//processTransaction(req.body[0]);

/* console.log(req1.body[0]);
connection.query('call specialWithdraw(?,?,?);', [req1.body[0].account_no, req1.body[0].amount, "agent"+req1.body[0].agent_Id], function(err, rows, fields) {
  if (err) throw err
  console.log('speciall transaction processed');
}); 


connection.query('select checkBalance(?,?);', [req1.body[0].account_no, req1.body[0].amount], function(err, rows, fields){
  if (err) throw err
  console.log(rows[0][fields[0].name])
  if (rows[0][fields[0].name] == 1){
    connection.query('call specialWithdraw(?,?,?);', [req1.body[0].account_no, req1.body[0].amount, req1.body[0].agent_Id], function(err, rows, fields) {
      if (err) throw err
      console.log('special transaction processed');
    });
  }
})



connection.query('select checkBalance(?,?);', [req1.body[0].account_no, req1.body[0].amount], function(err, rows, fields){
  if (err) throw err
  console.log(rows[0][fields[0].name])

  if (rows[0][fields[0].name] == 1){
    connection.query('call specialWithdraw(?,?,?);', [req1.body[0].account_no, req1.body[0].amount, req1.body[0].agent_Id], function(err, rows, fields) {
      if (err) throw err
      console.log('special transaction processed');
      //console.log(rows);
      rowsJSON = JSON.stringify(rows[0]);
      console.log(rowsJSON);
    });
  } else{
    //res.send('error, insufficient balance');
  }
})
*/