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
        layout:'prelayout'
    });
});

router.post('/register',(req,res)=>{
    var name = req.body.name;
    var reg_email = req.body.email;
    var reg_password = req.body.password;
    console.log('name:'+name+' email:'+reg_email+' password:'+reg_password);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    var datetime = date+' '+time;
    con.query('SELECT email FROM logintable WHERE email = ?',[reg_email],(err,result)=>{
        if(err) console.log('error while getting a non-existing email in the database!!!'+err);
        else{
            if(Object.keys(result).length == 1){
                res.json({
                    msg:'The email is already in use!!!'
                });
            }
            else{
                con.query('INSERT INTO logintable SET ?',{name: name, email: reg_email,password: reg_password,last_modified_time: datetime},(err,result)=>{
                    if(err) return console.log("error in line 41:"+err);
                    else return console.log('Number of records inserted: '+ result.affectedRows)
                });
                res.json({
                    msg:'success'
                });
            }
        }
        /*
        if(result[0] !== undefined){
            return res.render('register',{
                message: 'The email is already in use!'
            });
        }
        else{
            con.query('INSERT INTO logintable SET ?',{name: name, email: reg_email,password: reg_password,last_modified_time: datetime},(err,result)=>{
                if(err) return console.log(err);
                else return console.log('Number of records inserted: '+ result.affectedRows)
            });
            res.render('login',{
                message: ''
            });
        }
        */
    });
});


//User Login

router.get('/login', function(req, res, next) {
    res.render('login',{
        layout:'prelayout'
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
                        res.json({
                            msg:'success'
                        });
                    }
                    else{
                        res.json({
                            msg: 'Incorecct Password....Try Again!'
                        });
                    }
                }
            });
        }
        else{
            res.json({
                msg: 'Looks like the User was Not Registered!!!...please Register and Try again!!!'
            });
        }
    }); 
});

//User Forgot Password

router.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword',{
        layout:'prelayout'
    });
});
 


router.post('/forgotpassword',(req,res,next)=>{
    var email = req.body.email;
    var sql = 'SELECT email FROM logintable WHERE email = ?';
    con.query(sql,[email],(err,result)=>{
        console.log('Line 103:result:'+(result+1)+':');
        console.log('line 104:'+typeof result);
        if(Object.keys(result).length !== 0){
            con.query('SELECT id FROM logintable WHERE email = ?',[email],(err,emailresult)=>{
                if(err) return console.log('line 107:'+err);
                else{
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var time = today.getHours() + ":" + (today.getMinutes()+2) + ":" + today.getSeconds();
                    var dateTime = date+' '+time;
                    var id_val = emailresult[0].id;
                    con.query('UPDATE logintable SET last_modified_time = ? WHERE id = ?',[dateTime,id_val],(err,result)=>{
                        if(err) return console.log('line 115:'+err);
                        else{
                            var reqCode = `http://localhost:3000/user/updatepassword?id=${id_val}`;
                            var emailData = `
                                <h2>You have a password reset/update request</h2>
                                <h4>Click this link to update your password:</h4>
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
                                    pass: 'gxcgriiwevnwnqoj',
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
                                text: "Password reset request", // plain text body
                                html: emailData, // html body
                            });

                            //instead of rendering another page with simple message, try to print that simple message in the same page with jquery ajax
                            //var dataToSend = {'message':'Please check your mail to get password reset link'};
                            //var conclusion = JSON.stringify(dataToSend);
                            /*factual.get('/user/forgotpassword',{q:'Please check your mail you reset your password!!!'},function(error , data){
                                console.log('line 150:'+data);
                                res.writeHead(200,{'Content-Type':'application/json'});
                                res.end(JSON.stringify(data));
                            });*/
                            //res.send({ data: 'Please check your mail to reset your password!!!' });
                            res.json({
                                msg: 'please check your mail to reset your password.'
                            });
                        }
                    });  
                }
            });
        }
        else{
            res.json({
                msg:'There is no user registered with this email!!!....Try Again!!!'
            });
        }
    });
});


//User Update Password
router.get('/updatepassword',(req,res)=>{
    //sess = req.session;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" +today.getMinutes()+ ":" + today.getSeconds();
    var currentDateTime = date+' '+time;
    var id = req.query.id;
    var maxDateTime,date1,date2;
    date1 = new Date(currentDateTime);
    con.query('SELECT last_modified_time FROM logintable WHERE id = ?',[id],(err,timeResult)=>{
        if(err) return console.log('line 195:'+err);
        else{
            if(Object.keys(timeResult).length == 1){
                maxDateTime = timeResult[0].last_modified_time;
                date2 = new Date(maxDateTime);
                if(date1 < date2){
                    res.render('updatepassword',{
                        message: '',
                        id: id,
                        layout:'prelayout'
                    });
                    console.log(date1);
                    console.log(date2);
                // sess.randomNumber = Math.floor(Math.random()*10);
                }
                else{
                    res.render('updatepassword',{
                        message:'This is not a valid session / cannot update password / Your session has Expired!!!',
                        id: id,
                        layout:'prelayout'
                    });
                    console.log(date1);
                    console.log(date2);
                }
            }
            else{
                res.render('updatepassword',{
                    message:'The userid is not matched with any of our users in our database, so please try to register first!!!',
                    id: id,
                    layout:'prelayout'
                });
            }
        }
    });
});

router.post('/updatepassword',(req,res)=>{
    var id = req.body.id;
    var password = req.body.password;
    con.query('UPDATE logintable SET password = ? WHERE id = ?',[password,id],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/user/login');
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


