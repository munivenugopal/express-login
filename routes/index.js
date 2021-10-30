var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  con.query('SELECT * FROM products',(err,result)=>{
    if(err) return console.log(err);
    else res.render('index',{
      data: result
    });
  });
});

module.exports = router;
