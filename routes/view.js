var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var session =require("express-session");

//DATABASE CONNECTION
 var connection = mysql.createConnection({
  host : 'localhost',
  user : 'manager',
  password : 'manager@123',
  database : 'database_proj'
});

connection.connect();

//authentication
router.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
  }));
  
  // Authentication and Authorization Middleware
  var auth = function(req, res, next) {
    if (req.session && req.session.user === "manager" && req.session.admin)
      return next();
    else
      return res.sendStatus(401);
  };
  
  // Login endpoint
  router.get('/login', function (req, res) {
    if (!req.query.username || !req.query.password) {
      res.send('login failed');    
    } else if(req.query.username === "manager" && req.query.password === "managerpassword") {
      req.session.user = "manager";
      req.session.admin = true;
      res.send("login success!");
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












  
router.get('/acc_wise_report',auth, function(req, res, next) {
    res.render('acc_wise_report', { title: 'account wise report' });
});

router.post('/acc_wise_report',auth, function(req, res, next){

        var Acc = req.body.account_no
        console.log(Acc);

        var sdate=req.body.sdate
        console.log(sdate);

        var edate=req.body.edate
        console.log(edate);

        connection.query('select exist_no("'+Acc+'")', function (err, rows, fields){if (err) throw err
            console.log(rows[0][fields[0].name])
        
            if(rows[0][fields[0].name]==0){
                res.send("Account number may be invalid")
                } 
            });

        if (sdate>edate){
            console.log("date may be invalid")
            res.send("date may be invalid")
        }

        

        connection.query('select transaction_id,credit_debit,date_time,amount,type_,agent_id from transaction where account_no="'+Acc+'" and date_time>="'+sdate+'" and date_time<="'+edate+'";', function (err, rows, fields) {
            if (err) throw err
            console.log(rows)
            //setvalues(rows);
            res.render('display', {x:(JSON.stringify(rows))});
              
        })
        });



router.get('/agent_wise_report',auth, function(req, res, next) {
    res.render('agent_wise_report', { title: 'account wise report' });
});

router.post('/agent_wise_report',auth, function(req, res, next){
    //const x = req.body.username;
    var Agent = req.body.agent_id
    console.log(Agent);

    var sdate=req.body.sdate
    console.log(sdate);

    var edate=req.body.edate
    console.log(edate);

    connection.query('select exist_id("'+Agent+'")', function (err, rows, fields){if (err) throw err
    console.log(rows[0][fields[0].name])

    if(rows[0][fields[0].name]==0){
        res.send("Agent id may be invalid")
        } 
    });

    if (sdate>edate){
        console.log("date may be invalid")
        res.send("date may be invalid")
    }

    else{
        var que=connection.query('select transaction_id,account_no,credit_debit,date_time,amount,type_ from transaction where agent_id="'+Agent+'" and date_time>="'+sdate+'" and date_time<="'+edate+'";', function (err, rows, fields) {
            if (err) throw err
            
            //res.render('report_error')
            //console.log("Invalid agent ID")}
            //res.render('agent_wise_report', {items: rows});
            console.log(rows)
            res.render('adisplay', {x:(JSON.stringify(rows))});
        });
    }
});

module.exports = router;
