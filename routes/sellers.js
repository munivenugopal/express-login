var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});

var sess;
// GET sellers page.
router.get('/',(req,res)=>{
    sess = req.session;
    if(sess.email){
        con.query('SELECT s.sellerid , s.seller_name , p.ProductName FROM sellers AS s LEFT JOIN products AS p ON s.productid = p.ProductID ORDER BY s.sellerid',(err,result)=>{
            if(err) return console.log(err);
            else {
                con.query('SELECT ProductID,ProductName FROM products',(err,productresult)=>{
                    res.render('sellers',{
                        data: result,
                        productsdata: productresult,
                        layout:'applayout'
                    });
                });
            }
        });
    }
    else{
        res.redirect('/user/login');
    }
    
});

//add new seller 

router.get('/add',(req,res)=>{
    con.query('SELECT ProductName FROM products',(err,productslist)=>{
        res.render('addseller',{
            message:' ',
            productslist: productslist,
            layout:'applayout'
        });
    });
});

var productid;
router.post('/add',(req,res)=>{
    
    var sellername = req.body.SellerName;
    var selectedProduct = req.body.product;

    console.log(selectedProduct);
    
    con.query('SELECT ProductID FROM products WHERE ProductName = ?',[selectedProduct],(err,result)=>{
        productid = result[0]['ProductID'];
        console.log(productid);
        var sql = 'INSERT INTO sellers (seller_name,productid) VALUES(?,?)';
        con.query(sql,[sellername,productid],(err,result)=>{
            if(err) {
                console.log('Error while inserting alien product id"s'+err);
                res.render('addseller',{
                    message: "Entered Product ID is not a valid ID, Check Products Page for ProductID's.",
                    layout:"applayout"
                });
            } 
            else {
                con.query('SELECT ProductID,ProductName FROM products',(err,productresult)=>{
                    con.query('SELECT s.sellerid , s.seller_name , p.ProductName FROM sellers AS s LEFT JOIN products AS p ON s.productid = p.ProductID ORDER BY s.sellerid',(err,sellerstable)=>{
                        res.render('sellers',{
                            data: sellerstable,
                            productsdata: productresult,
                            layout:'applayout'
                        });
                    });
                });
            }
        });
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
            con.query('SELECT ProductName FROM products',(err,productslist)=>{
                res.render('editseller',{
                    data: result,
                    warning: ' ',
                    productslist: productslist,
                    layout:'applayout'
                });
            });
        }
    });
});

router.post('/editseller',(req,res)=>{
    var sellername = req.body.SellerName;
    var selectedProduct = req.body.product;

    con.query('SELECT ProductID FROM products WHERE ProductName = ?',[selectedProduct],(err,result)=>{
        if(err) return console.log(err);
        else{
            productid = result[0]['ProductID'];
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
                                warning: 'Entered Product ID is not a valid ID, Check Products Page for ProductID`s. ',
                                layout:'applayout'
                            });
                        }
                    });
                }
                else {
                    con.query('SELECT ProductID,ProductName FROM products',(err,productresult)=>{
                        con.query('SELECT s.sellerid , s.seller_name , p.ProductName FROM sellers AS s LEFT JOIN products AS p ON s.productid = p.ProductID ORDER BY s.sellerid',(err,sellerstable)=>{
                            res.render('sellers',{
                                data: sellerstable,
                                productsdata: productresult,
                                layout:'applayout'
                            });
                        });
                    });
                }
            });
        }
    })
});

//Delete Seller

router.get('/deleteseller',(req,res)=>{
    var sellerid = req.query.sellerid;
    con.query('DELETE FROM sellers WHERE sellerid = ?',[sellerid],(err,result)=>{
        if(err) return console.log(err);
        else {
            con.query('SELECT ProductID,ProductName FROM products',(err,productresult)=>{
                con.query('SELECT s.sellerid , s.seller_name , p.ProductName FROM sellers AS s LEFT JOIN products AS p ON s.productid = p.ProductID ORDER BY s.sellerid',(err,sellerstable)=>{
                    res.render('sellers',{
                        data: sellerstable,
                        productsdata: productresult,
                        layout:'applayout'
                    });
                });
            });
        }
    });
});

//view selected seller

router.get('/viewseller',(req,res)=>{
    var sellerid = req.query.sellerid;
    var sql = 'select ProductName from products where ProductID = (select productid from sellers where sellerid = ?)';
    con.query(sql,[sellerid],(err,result)=>{
        if(err) return console.log(err);
        else{
            con.query('select seller_name from sellers where sellerid = ?',[sellerid],(err,sellername)=>{
                res.render('viewseller',{
                    data: result,
                    sellername: sellername,
                    layout:'applayout'
                });
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
                    productname: productname,
                    layout:'applayout'
                });
                console.log(productname);
            });
        }
        else{
            con.query('SELECT ProductName FROM products WHERE ProductID = ?',[productid],(err,productname)=>{
                res.render('viewproduct',{
                    sellersdata: result,
                    message:'',
                    productname: productname,
                    layout:'applayout'
                });
            });
        }
    });
});

module.exports = router;