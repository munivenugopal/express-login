var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});
var productid=0;


router.get('/', function(req, res, next) {
    //res.render('edit')
    productid = req.query.productid;
    var sql = 'SELECT * FROM products WHERE ProductID = ?';
    con.query(sql,[productid],(err,result)=>{
        if(err) return console.log(err);
        else{
            res.render('edit',{
                data: result
            });
        }
    });
});

router.post('/',(req,res)=>{
    var productname = req.body.ProductName;
    var unit = req.body.Unit;
    var price = req.body.Price;
    var sql = 'UPDATE products SET ProductName = ? , Unit = ? , Price = ? WHERE ProductID = ?';
    con.query(sql,[productname,unit,price,productid],(err,result)=>{
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
