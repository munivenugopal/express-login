var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
const { route } = require('./shipment');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpasswordgiven',
    database: 'taskbook'
});


/* GET products page. */
router.get('/', function (req, res, next) {
    var sess = req.session;
    if (sess.email) {
        res.render('index', {
            layout: 'applayout'
        });
    }
    else {
        res.redirect('/user/login');
    }
});

router.get('/getproducts', (req, res) => {
    con.query('SELECT p.ProductID,p.ProductName,p.Unit,p.Price,c.name FROM products AS p LEFT JOIN category AS c ON p.category_id = c.id', (err, productslist) => {
        res.json({
            msg: 'success',
            productslist: productslist,
        });
    });
});

//edit router

router.get('/edit', (req, res) => {
    var editproductid = req.query.productid;
    var sess = req.session;
    if (sess.email) {
        res.render('edit', {
            layout: 'applayout',
            id:editproductid
        });
    }
    else {
        res.redirect('/user/login');
    }
});

router.post('/editproductgetid', function (req, res, next) {
    var editproductid = req.body.id;
    var sql = 'SELECT * FROM products WHERE ProductID = ?';
    con.query(sql, [editproductid], (err, result) => {
        if (err) return console.log(err);
        else {
            con.query('SELECT name FROM category ORDER BY name', (err, categorylist) => {
                if (err) return console.log('line 42:' + err);
                else {
                    res.json({
                        msg: 'success',
                        data: result,
                        categorylist: categorylist,
                    });
                }
            });
        }
    });
});

router.post('/editproduct', (req, res) => {
    var editproductid = req.body.ProductID;
    var productname = req.body.ProductName;
    var unit = req.body.Unit;
    var price = req.body.Price;
    var selectedCategory = req.body.selectedCategory;
    console.log('line 78:'+selectedCategory);
    con.query('SELECT id FROM category WHERE name = ?', [selectedCategory], (err, result) => {
        if (!err) {
            console.log('line 64:' + result[0].id);
            var category_id = result[0].id;
            var sql = 'UPDATE products SET ProductName = ? , Unit = ? , Price = ?,category_id = ? WHERE ProductID = ?';
            con.query(sql, [productname, unit, price, category_id, editproductid], (err, result) => {
                if (err) return console.log('line 83' + err);
                else {
                    con.query('SELECT p.ProductID,p.ProductName,p.Unit,p.Price,c.name FROM products AS p LEFT JOIN category AS c ON p.category_id = c.id', (err, result) => {
                        if (err) return console.log(err);
                        else {
                            res.json({
                                msg: 'success'
                            });
                        }
                    });
                }
            });
        }
        else {
            console.log('Error at line 97' + err)
        }
    });
});


//delete router

router.get('/delete', (req, res) => {
    var productid = req.query.productid;
    con.query('DELETE FROM products WHERE ProductID = ?', [productid], (err, result) => {
        if (err) return console.log(err);
        else {
            con.query('SELECT p.ProductID,p.ProductName,p.Unit,p.Price,c.name FROM products AS p LEFT JOIN category AS c ON p.category_id = c.id', (err, result) => {
                if (err) return console.log(err);
                else {
                    res.render('index', {
                        data: result,
                        layout: 'applayout'
                    });
                }
            });
        }
    });
});

//add new product router
router.get('/add',(req,res)=>{
    res.render('add',{
        layout:'applayout'
    });
});

router.get('/addproduct', (req, res) => {
    con.query('SELECT name FROM category ORDER BY name', (err, categorylist) => {
        res.json({
            msg:'success',
            categorylist: categorylist
        });
    });
});

router.post('/addproduct', (req, res) => {
    var selectedCategory = req.body.selectedCategory;
    con.query('SELECT id FROM category WHERE name = ?', [selectedCategory], (err, result) => {
        console.log(JSON.stringify(result));
        var category_id = result[0].id;
        var productname = req.body.ProductName;
        var unit = req.body.Unit;
        var price = req.body.Price;
        var sql = 'INSERT INTO products (ProductName,Unit,Price,category_id) VALUES(?,?,?,?)';
        con.query(sql, [productname, unit, price, category_id], (err, result) => {
            if (err) return console.log(err);
            else {
                res.json({
                    msg:'success'
                });
            }
        });
    });
});

//view selected product

router.get('/view',(req,res)=>{
    var productid = req.query.productid;
    res.render('view',{
        layout:'applayout',
        id:productid
    });
});

router.post('/viewproduct', (req, res) => {
    var productid = req.body.productid;
    console.log('line 174:'+productid);
    var sql = 'SELECT * FROM products WHERE ProductID=?';
    con.query(sql, [productid], (err, result) => {
        if (err) return console.log(err);
        else {
            con.query('SELECT seller_name FROM sellers WHERE productid = ?', [productid], (err, sellerslist) => {
                con.query('SELECT name FROM category WHERE id = (SELECT category_id FROM products WHERE ProductID = ?)', [productid], (err, categoryname) => {
                    res.json({
                        msg:'success',
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
