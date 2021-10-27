var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpasswordgiven',
    database: 'taskbook'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register',{
    message: ''
  });
});

router.post('/',(req,res)=>{
  console.log(req.body);
  var name = req.body.name;
  var reg_email = req.body.email;
  var reg_password = req.body.password;
  con.query('SELECT email FROM logintable WHERE email=?',[reg_email],(err,result)=>{
    console.log(result);
    if (result[0] !== undefined){
        console.log("The Eneterd Email is Already Registered!!");
        return res.render('register.ejs',{
          message : 'The email is already in use'
        }); 
    }
    else{
        con.query('INSERT INTO logintable SET ?',{name: name,email: reg_email,password: reg_password},(err,result)=>{
          if(err) { console.log(err) }
          else{ console.log('Number of records inserted: '+ result.affectedRows)}
        });
        res.redirect('/login')
        }
    });
});

module.exports = router;
