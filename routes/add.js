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
    res.render('add')
});

router.post('/',(req,res)=>{
    var productname = req.body.ProductName;
    var unit = req.body.Unit;
    var price = req.body.Price;
    var sql = 'INSERT INTO products (ProductName,Unit,Price) VALUES(?,?,?)';
    con.query(sql,[productname,unit,price],(err,result)=>{
        if(err) return console.log(err);
        else {
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