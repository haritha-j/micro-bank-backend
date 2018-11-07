var mysql = require('mysql');
var db;
var settings={
    host     : 'localhost',
    user     : 'root',
    password : '123',
    database : 'meanstack'
}

function connectDatabase(){
    if(!db){
        db= mysql.createConnection(settings);
    
    db.connect(function(err){
       if(!err){
           console.log('Database Connected');
       }else{
        console.log('Database not Connected');
       }
    });
}
return db;
}

module.exports= connectDatabase();