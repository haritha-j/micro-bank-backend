var express=  require('express');
var path= require('path');
var cors= require('cors');
var bodyParser=  require('body-parser');
var connection= require("./connection");


const app= express();
const router=express.Router();
app.use(cors());
app.use(bodyParser.json());





router.route('/issues').get((req,res)=>{
    connection.query('SELECT * FROM issues2',function(err, rows){

        if(err) throw err;
       
        
        console.log(rows);
        res.send(rows);
   });
})

router.route('/issues/add').post((req,res)=>{
    const userdata={
        title:req.body.title,
        long:req.body.long,
        description:req.body.description,
        lat:req.body.lat,
        status:req.body.status
        }
        
        connection.query('INSERT INTO issues2 SET ?',userdata, function(err,result){
            if(err) throw err;
            //console.log('dsjksjs');
            res.status(200).json({'issue':'Added Successfully'});
        } );
});

router.route('/issues/delete/:id').get((req,res)=>{
    var userid= req.params.id;

    connection.query('DELETE FROM issues2 WHERE id=?',[userid],(err,rows)=>{
        if(err) throw err;
        res.status(200).json({'issue':' Successfully Deleted'});
    })
})



app.use('/',router);
app.listen(3000,()=>{
    console.log("server started on port:"+3000);
})