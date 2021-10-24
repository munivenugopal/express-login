const express = require('express')
const mysql = require('mysql')
const app = express()

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpasswordgiven',
    database: 'taskbook'
})

con.connect((err)=>{
    if (err) return console.log(err)
    console.log('Connected to MySQL!')
})

app.set("view-engine",'ejs')
app.use(express.urlencoded({extended: false}))

//----------------------------------------
app.get('/login',(req,res)=>{
    res.render('login.ejs')
    //query : SELECT registered data from /register to console
})

app.post('/login',(req,res)=>{
    console.log(req.body)
    var log_email = req.body.email
    var log_password = req.body.password
    con.query('SELECT password FROM logintable WHERE email = ?',[log_email],(err,result)=>{
        if (err) return console.log(err)
        else{ if( log_password === result[0].password ){  
                    res.redirect('/index')
                }
                else{
                    res.render('passworderror.ejs',{
                        message: 'Wrong Password...'
                    })
                }
        }
    })
})
//-----------------------------------------
app.get('/index',(req,res)=>{
    res.render('index.ejs')
})
//-----------------------------------------
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

app.post('/register',(req,res)=>{
    //insert data into logintable from the input from register page
    console.log(req.body)
    var name = req.body.name
    var reg_email = req.body.email
    var reg_password = req.body.password
    
    con.query('SELECT email FROM logintable WHERE email=?',[reg_email],(err,result)=>{
        console.log(result)
        if (result[0] !== undefined){
            console.log("The Eneterd Email is Already Registered!!")
            return res.render('error.ejs',{
                message : 'The email is already in use'
            })  
        }
        else{
            con.query('INSERT INTO logintable SET ?',{name: name,email: reg_email,password: reg_password},(err,result)=>{
                if(err) { console.log(err) }
                else{ console.log('Number of records inserted: '+ result.affectedRows)}
            })
            res.redirect('/login')
       
        }
    })
})

//----------------------------------------

app.listen(3000,(err)=>{
    if(err) return console.log(err)
    return console.log('Express is running on port number: 3000')
})