var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});

// GET sellers page.
router.get('/',(req,res)=>{
    con.query('SELECT * FROM sellers',(err,result)=>{
        if(err) return console.log(err);
        else {
            con.query('SELECT ProductID,ProductName FROM products',(err,productresult)=>{
                res.render('sellers',{
                    data: result,
                    productsdata: productresult
                });
            });
        }
    });
});

//add new seller 

router.get('/add',(req,res)=>{
    res.render('addseller',{
        message:' '
    });
});

router.post('/add',(req,res)=>{
    var sellername = req.body.SellerName;
    var productid = req.body.ProductID;
    var sql = 'INSERT INTO sellers (seller_name,productid) VALUES(?,?)';
    con.query(sql,[sellername,productid],(err,result)=>{
        if(err) {
            console.log('Error while inserting alien product id"s'+err);
            res.render('addseller',{
                message: "Entered Product ID is not a valid ID, Check Products Page for ProductID's."
            });
        } 
        else{
            con.query('SELECT * FROM sellers',(err,result)=>{
                if(err) return console.log(err);
                else{
                    res.render('sellers',{
                        data: result
                    });
                }
            });
        }
    });
});

//edit selected Seller

var editsellerid = 0;

router.get('/editseller',(req,res)=>{
    editsellerid = req.query.sellerid;
    var sql = 'SELECT * FROM sellers WHERE sellerid = ?';
    con.query(sql,[editsellerid],(err,result)=>{
        if(err) return console.log(err);
        else{
            res.render('editseller',{
                data: result,
                warning: ' '
            });
        }
    });
});

router.post('/editseller',(req,res)=>{
    var sellername = req.body.SellerName;
    var productid = req.body.ProductID;
    var sql = 'UPDATE sellers SET seller_name = ?, productid = ? WHERE sellerid = ? ';
    con.query(sql,[sellername,productid,editsellerid],(err,result)=>{
        if(err){
            console.log('Error while entering alien product id"s'+err);
            var sql = 'SELECT * FROM sellers WHERE sellerid = ?';
            con.query(sql,[editsellerid],(err,result)=>{
                if(err) return console.log(err);
                else{
                    res.render('editseller',{
                        data: result,
                        warning: 'Entered Product ID is not a valid ID, Check Products Page for ProductID`s. '
                    });
                }
            });
        }
        else{
            con.query('SELECT * FROM sellers',(err,result)=>{
                if(err) return console.log(err);
                else{
                    res.render('sellers',{
                        data: result
                    });
                }
            });
        }
    });
});

//Delete Seller

router.get('/deleteseller',(req,res)=>{
    var sellerid = req.query.sellerid;
    con.query('DELETE FROM sellers WHERE sellerid = ?',[sellerid],(err,result)=>{
        if(err) return console.log(err);
        else{
            con.query('SELECT * FROM sellers',(err,result)=>{
                if(err) return console.log(err);
                else{
                    res.render('sellers',{
                        data: result
                    });
                }
            });
        }
    });
});

//view selected seller

router.get('/viewseller',(req,res)=>{
    var sellerid = req.query.sellerid;
    var sql = 'SELECT * FROM sellers WHERE sellerid = ?';
    con.query(sql,[sellerid],(err,result)=>{
        if(err) return console.log(err);
        else{
            res.render('viewseller',{
                data: result
            });
        }
    });
});

//get product

router.get('/viewproduct',(req,res)=>{
    var productid = req.query.productid;
    var sql = 'SELECT seller_name FROM sellers WHERE productid = ?';
    con.query(sql,[productid],(err,result)=>{
        if(result[0] === undefined){
            con.query('SELECT ProductName FROM products WHERE ProductID = ?',[productid],(err,productname)=>{
                res.render('viewproduct',{
                    sellersdata:'',
                    message:"Looks like this product has no sellers available. First add Sellers for this product in Sellers Page!!!.",
                    productname: productname
                });
                console.log(productname);
            });
        }
        else{
            con.query('SELECT ProductName FROM products WHERE ProductID = ?',[productid],(err,productname)=>{
                res.render('viewproduct',{
                    sellersdata: result,
                    message:'',
                    productname: productname
                });
            });
        }
    });
});

module.exports = router;