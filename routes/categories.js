var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});

//get category home page

router.get('/',(req,res)=>{
  con.query('SELECT * FROM category ORDER BY name',(err,categorylist)=>{
    res.render('category',{
      categorylist: categorylist
    });
  });
});

//get view category page

router.get('/viewcategory',(req,res)=>{
  var category_id = req.query.category_id;
  con.query('SELECT ProductName FROM products WHERE category_id = ?',[category_id],(err,result)=>{
    con.query('SELECT name FROM category WHERE id = ?',[category_id],(err,category_name)=>{
      res.render('viewcategory',{
        data: result,
        category_name: category_name
      });
    });
  });
});


module.exports = router;