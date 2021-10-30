var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});

var productid = 0;

router.get('/',(req,res)=>{
    productid = req.query.productid;
    var sql = 'SELECT * FROM products WHERE ProductID=?';
    con.query(sql,[productid],(err,result)=>{
        if(err) return console.log(err);
        else{
            res.render('view',{
                data: result
            });
        }
    })
});

module.exports = router;
