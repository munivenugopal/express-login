var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpasswordgiven',
    database: 'taskbook'
});

/* GET forgotpassword page. */
router.get('/', function(req, res, next) {
  res.render('forgotpassword',{
      message: ''
  });
});

router.post('/',(req,res,next)=>{
    var email = req.body.email;
    var newpassword = req.body.newpassword;
    var againnewpassword = req.body.againnewpassword;
    if(newpassword === againnewpassword){
        var sql = 'UPDATE logintable SET password=? WHERE email=?';
        con.query(sql,[newpassword,email],(err,result)=>{
            if(err) return console.log(err);
            else {
                res.redirect('/login');
            }
        });
    }
    else{
        res.render('forgotpassword',{
            message: "Wrong Attempt....Try again..."
        });
    }
});

module.exports = router;