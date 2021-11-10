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
    con.query('SELECT p.ProductID,p.ProductName,p.Unit,p.Price,c.name FROM products AS p LEFT JOIN category AS c ON p.category_id = c.id',(err,result)=>{
        if(err) return console.log(err);
        else{
            res.render('index',{
                data: result
            });
        }
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
            con.query('SELECT name FROM category ORDER BY name',(err,categorylist)=>{
                res.render('edit',{
                    data: result,
                    categorylist: categorylist
                });
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
            con.query('SELECT p.ProductID,p.ProductName,p.Unit,p.Price,c.name FROM products AS p LEFT JOIN category AS c ON p.category_id = c.id',(err,result)=>{
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
        con.query('SELECT p.ProductID,p.ProductName,p.Unit,p.Price,c.name FROM products AS p LEFT JOIN category AS c ON p.category_id = c.id',(err,result)=>{
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
    con.query('SELECT name FROM category ORDER BY name',(err,categorylist)=>{
        res.render('add',{
            categorylist: categorylist
        });
    });
});

router.post('/add',(req,res)=>{
  var selectedCategory = req.body.selectedCategory;
  con.query('SELECT id FROM category WHERE name = ?',[selectedCategory],(err,result)=>{
      var category_id = result[0]['id'];
      var productname = req.body.ProductName;
      var unit = req.body.Unit;
      var price = req.body.Price;
      var sql = 'INSERT INTO products (ProductName,Unit,Price,category_id) VALUES(?,?,?,?)';
      con.query(sql,[productname,unit,price,category_id],(err,result)=>{
          if(err) return console.log(err);
          else {
              con.query('SELECT p.ProductID,p.ProductName,p.Unit,p.Price,c.name FROM products AS p LEFT JOIN category AS c ON p.category_id = c.id',(err,result)=>{
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
});

//view selected product

router.get('/view',(req,res)=>{
    productid = req.query.productid;
    var sql = 'SELECT * FROM products WHERE ProductID=?';
    con.query(sql,[productid],(err,result)=>{
      if(err) return console.log(err);
      else{
          con.query('SELECT seller_name FROM sellers WHERE productid = ?',[productid],(err,sellerslist)=>{
              con.query('SELECT name FROM category WHERE id = (SELECT category_id FROM products WHERE ProductID = ?)',[productid],(err,categoryname)=>{
                res.render('view',{
                    data: result,
                    sellerslist: sellerslist,
                    categoryname: categoryname
                });
            }) 
        });
      }
    });
});

module.exports = router;
