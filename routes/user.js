var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var nodemailer = require('nodemailer');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});


//User Register

router.get('/register',(req,res,next)=>{
    res.render('register',{
        message: ''
    });
});

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

var sess;

router.post('/login', (req,res)=>{
    sess = req.session;
    sess.email = req.body.email;
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

var reqCode; 
var email;
router.post('/forgotpassword',(req,res,next)=>{
    email = req.body.email;
    var sql = 'SELECT email FROM logintable WHERE email = ?';
    con.query(sql,[email],(err,result)=>{
        if(result[0] !== undefined){
            reqCode = Math.floor(Math.random() * 1000000);
            console.log('Verification code is: '+reqCode);
            var emailData = `
                <p>You have a password reset update request</p>
                <h4>Verification Code:</h4>
                <p> ${reqCode} </p>
            `
                // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                //host: 'smtp.ethereal.email',
                //port: 587,
                //secure: false,
                service: 'Gmail',
                auth: {
                    user: 'mvg.0727@gmail.com',
                    pass: 'gxcgriiwevnwnqoj'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // send mail with defined transport object
            let info = transporter.sendMail({
                from: '"Express Application" <mvg.0727@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Password reset request", // Subject line
                text: "copy the below code", // plain text body
                html: emailData, // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            res.render('verify',{
                message: ''
            });
        }
        else{
            res.render('forgotpassword',{
                message:'There is no user registered with this email!!!....Try Again!!!'
            });
        }
    });
});

//User Reset Verification

router.post('/reset',(req,res)=>{
    var code = req.body.code;
    console.log(code);
    console.log(reqCode);
    if(code == reqCode){
        res.render('updatepassword');
    }
    else{
        res.render('verify',{
            message: 'Wrong Attempt Try Again'
        });
    }
});

//User Update Password

router.post('/updatepassword',(req,res)=>{
    var password = req.body.password;
    con.query('UPDATE logintable SET password = ? WHERE email = ?',[password,email],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('login',{
                message: ''
            });
        }
    })
});

//User Logout

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/user/login');
        }
    });
});


module.exports = router;


