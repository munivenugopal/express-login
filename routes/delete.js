var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});


router.get('/',(req,res)=>{
    var productid = req.query.productid;
    con.query('DELETE FROM products WHERE ProductID = ?',[productid],(err,result)=>{
        if(err) return console.log(err);
        else{
            con.query('SELECT * FROM products',(err,result)=>{
                if(err) return console.log(err);
                else{
                    res.render('index',{
                        data: result
                    });
                }
            });
        }
    });
}); 

module.exports = router;
