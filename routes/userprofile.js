var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpasswordgiven',
    database: 'taskbook'
});

router.get('/', (req, res) => {
    var sess = req.session;
    if(sess.email){
        res.render('profile', {
            layout: 'applayout'
        });
    }
});

router.get('/getprofile',(req,res)=>{
    var sess = req.session;
    var email = sess.email;
    con.query('SELECT * FROM profile WHERE email = ?',[email],(err,result)=>{
        if(err) return console.log('Error in line 26:'+err);
        else if(Object.keys(result).length === 0){
            console.log('line 28:'+result);
            res.json({
                msg:'failure'
            });
        }
        else{
            res.json({
                msg:'success',
                profileData:result
            });
        }
    });
});

router.get('/getsessmail',(req,res)=>{
    var sess = req.session;
    con.query('SELECT id,name,email FROM logintable WHERE email = ?',[sess.email],(err,result)=>{
        if(err) return console.log('line 25'+err);
        else{
            var id = result[0].id;
            var name = result[0].name;
            var email = result[0].email;
            con.query('SELECT id FROM profile WHERE email = ?',[email],(err,id_of_existing_profile)=>{
                if(err) return console.log("line 32:err"+err);
                else if(Object.keys(id_of_existing_profile).length == 1){
                    console.log('line 32,id_of_existing_profile:'+id_of_existing_profile);
                    con.query('SELECT * FROM profile WHERE id=?',[id],(err,result)=>{
                        if(err) return console.log('line 35:'+err);
                        else{
                            res.json({
                                msg:'success',
                                basicData:result
                            });
                        }
                    });
                } 
                else{
                    console.log("came into else block: means it doesn't have existing profile data!!");
                    con.query('INSERT INTO profile (id,name,email) VALUES (?,?,?)',[id,name,email],(err,result)=>{
                        if(err) return console.log('line 31:'+err);
                        else{
                            con.query('SELECT * FROM profile WHERE id=?',[id],(err,result)=>{
                                if(err) return console.log('line 34:'+err);
                                else{
                                    res.json({
                                        msg:'success',
                                        basicData:result
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


router.post('/getprofiledata',(req,res)=>{
    var sess = req.session;
    var email = sess.email;
    var phone = req.body.phone;
    var state = req.body.state;
    var city = req.body.city;
    var address =  req.body.address;
    var company = req.body.company;
    var role = req.body.role;
    var salary = req.body.salary;
    var meta = req.body.meta;
    var twitter = req.body.twitter;
    var linkedin = req.body.linkedin;
    var hobby1 = req.body.hobby1;
    var hobby2 = req.body.hobby2;
    var hobby3 = req.body.hobby3;
    con.query('UPDATE profile SET phone = ?,state = ?,city = ?,address = ?,company = ?,role = ?,salary = ?,meta = ?,twitter = ?,linkedin = ?,hobby1 = ?,hobby2 = ?,hobby3 = ? WHERE email = ?',[phone,state,city,address,company,role,salary,meta,twitter,linkedin,hobby1,hobby2,hobby3,email],(err,result)=>{
        if(err) return console.log('Error at line 84:'+err);
        else{
            res.json({
                msg:'success'
            });
        }
    });
});


module.exports = router;