var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { route } = require('./products');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpasswordgiven',
  database: 'taskbook'
});

router.get('/',(req,res)=>{
    res.render('shipment',{
        layout:'applayout'
    });
});

router.get('/getstates',(req,res)=>{
    con.query('SELECT DISTINCT city_state FROM cities ORDER BY city_state',(err,stateslist)=>{
        if(err) return console.log('line 19'+err);
        else{
            res.json({
                msg:'success',
                states:stateslist
            });
        }
    });
});

router.post('/getstates',(req,res)=>{
    var state_name = req.body.state_name;
    con.query('SELECT city_name FROM cities WHERE city_state = ?',[state_name],(err,citylist)=>{
        if(err) return console.log('line 34:'+err);
        else{
            res.json({
                msg:'success',
                cities:citylist
            });
        }
    });
});


module.exports = router;