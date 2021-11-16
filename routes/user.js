var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});

router.get('/register',(req,res)=>{
    res.render('register',{
        message: ''
    });
});

//User Register

router.post('/register',(req,res)=>{
    var name = req.body.name;
    var reg_email = req.body.email;
    var reg_password = req.body.password;
    con.query('SELECT email FROM logintable WHERE email = ?',[reg_email],(err,result)=>{
        if(result[0] !== undefined){
            return res.render('register',{
                message: 'The email is already in use!'
            });
        }
        else{
            con.query('INSERT INTO logintable SET ?',{name: name, email: reg_email,password: reg_password},(err,result)=>{
                if(err) return console.log(err);
                else return console.log('Number of records inserted: '+ result.affectedRows)
            });
            res.render('login',{
                message: ''
            });
        }
    });
});


//User Login

router.get('/login', function(req, res, next) {
    res.render('login',{
        message:''
    });
});

router.post('/login', (req,res)=>{
    console.log(req.body);
    var log_email = req.body.email;
    var log_password = req.body.password;
    con.query('SELECT email FROM logintable WHERE email=?',[log_email],(err,result)=>{
        if (result[0] !== undefined){
            con.query('SELECT password FROM logintable WHERE email=?',[log_email],(err,result)=>{
                if (err) return console.log(err);
                else{
                    if (result[0].password === log_password){
                        res.redirect('/products');
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

//User Forgot Password

router.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword',{
        message:''
    });
});

router.post('/forgotpassword',(req,res,next)=>{
    var email = req.body.email;
    var newpassword = req.body.newpassword;
    var sqlforemail = 'SELECT email FROM logintable WHERE email=?';
    con.query(sqlforemail,[email],(err,result)=>{
        if (result[0] !== undefined){
            var sql = 'UPDATE logintable SET password=? WHERE email=?';
            con.query(sql,[newpassword,email],(err,result)=>{
                if(err) return console.log(err);
                else {
                        res.redirect('/user/login');
                }
            });
        }
        else{
            res.render('forgotpassword',{
                message:'There is no user registered with this email!!!....Try Again!!!'
            });
        }
    });
});
module.exports = router;


