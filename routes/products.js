var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});


/* GET products page. */
router.get('/', function(req, res, next) {
  con.query('SELECT * FROM products',(err,result)=>{
    if(err) return console.log(err);
    else res.render('index',{
      data: result
    });
  });
});

//edit router
var editproductid=0;

router.get('/edit', function(req, res, next) {
    editproductid = req.query.productid;
    var sql = 'SELECT * FROM products WHERE ProductID = ?';
    con.query(sql,[editproductid],(err,result)=>{
        if(err) return console.log(err);
        else{
            res.render('edit',{
                data: result
            });
        }
    });
});

router.post('/edit',(req,res)=>{
    var productname = req.body.ProductName;
    var unit = req.body.Unit;
    var price = req.body.Price;
    var sql = 'UPDATE products SET ProductName = ? , Unit = ? , Price = ? WHERE ProductID = ?';
    con.query(sql,[productname,unit,price,editproductid],(err,result)=>{
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


//delete router

router.get('/delete',(req,res)=>{
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

//add new product router

router.get('/add',(req,res)=>{
  res.render('add')
});

router.post('/add',(req,res)=>{
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

//view selected product

router.get('/view',(req,res)=>{
  productid = req.query.productid;
  var sql = 'SELECT * FROM products WHERE ProductID=?';
  con.query(sql,[productid],(err,result)=>{
      if(err) return console.log(err);
      else{
          con.query('SELECT seller_name FROM sellers WHERE productid = ?',[productid],(err,sellerslist)=>{
            res.render('view',{
                data: result,
                sellerslist: sellerslist
            });
          });
      }
  })
});

module.exports = router;
