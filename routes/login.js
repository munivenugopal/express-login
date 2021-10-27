var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpasswordgiven',
    database: 'taskbook'
})

router.get('/', function(req, res, next) {
    res.render('login',{
        message:''
    });
});

router.post('/', (req,res)=>{
    console.log(req.body);
    var log_email = req.body.email;
    var log_password = req.body.password;
    con.query('SELECT email FROM logintable WHERE email=?',[log_email],(err,result)=>{
        if (result[0] !== undefined){
            con.query('SELECT password FROM logintable WHERE email=?',[log_email],(err,result)=>{
                if (err) return console.log(err);
                else{
                    if (result[0].password === log_password){
                        res.redirect('/welcome');
                    }
                    else{
                        res.render('login',{
                            message: 'Incorecct Password....Try Again!'
                        });
                    }
                }
            });
        }
        else{
            res.render('login',{
                message: 'Looks like the User was Not Registered!!!...please Register and Try again!!!'
            });
        }
    }); 
});

module.exports = router;
  