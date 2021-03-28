 var express=require('express');
 const session = require('express-session');


 var bodyParser=require('body-parser');
 
 var app=express();
 app.use(bodyParser());
 app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
  }));

 var http = require('http');

 var fs = require('fs');
 var path=require('path');
 var url = "mongodb://localhost:27017/Testttt";

 const mongoose = require('mongoose'); 
 var hrscema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    country: String,
    shows: [Number]
    

});
 mongoose.Promise = global.Promise;
 var mnn= mongoose.model('details', hrscema);
 var nwscema = new mongoose.Schema({
    title: String,
    id: Number,
    content: String,
    producer: String,
    network: String,
    bimage: String
    

});
 mongoose.Promise = global.Promise;
 var mnn2= mongoose.model('Shows', nwscema);

 mongoose.connect('mongodb://localhost:27017/Testttt', function (err) {
 
    if (err) throw err;
  
    console.log('Successfully connected');
  
 });
 
 var db=mongoose.connection;

 var pug = require('pug');
 app.set('view engine', 'pug');


 app.use(bodyParser.json()); 
 app.use(express.static('public')); 

 app.use(bodyParser.urlencoded({ 
     extended: true
 })); 
 var i=0;
 
    

 app.post('/signup', function(req,res){ 
    var fn = req.body.fname; 
    var ln = req.body.lname;
    var em =req.body.email; 
    var pa = req.body.pass;
    var ci =req.body.country; 
    
    
    
    console.log('adding data to db');
    var data = { 
        "firstname": fn, 
        "lastname": ln,
        "email":em, 
        "password":pa, 
        "country":ci
        



    } 
    
    db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 
          
    res.sendFile(path.join(__dirname + '/login.html')); 
}) 
app.post('/login', function(req, res){ 
    var fn = req.body.email; 
    var ln = req.body.password;
    
    console.log("yahooo"+ fn+ ln );
    db.collection('details').findOne({ email: fn, password: ln }, function(err, collection){
        if(err){
            console.log("Invalid User");
            res.sendFile(path.join(__dirname + '/login.html'));
        }else{
            console.log("User found");
            if (collection!=null){
                if (collection.email === fn && collection.password === ln){
                    console.log("right details");
                    req.session.firstname=collection.firstname;
                    req.session.lastname=collection.lastname;
                    req.session.email=collection.email;
                    req.session.country=collection.country;
                    req.session.pimage=collection.pimage;
                    console.log(req.session.firstname);
                    console.log(req.session.lastname);
                    req.session.name=req.session.firstname+" "+req.session.lastname;
                    console.log(collection.email);
                    i=1;
                    res.redirect('/');
    
                }else {
                    console.log("wrong details");
                    
                    res.sendFile(path.join(__dirname + '/login.html'));
                }

            }else{
                console.log("Invalid User");
                res.sendFile(path.join(__dirname + '/login.html'));
            }
            
            
            
        }
    })
    
     
})
app.post('/postnews',function(req,res){
    var ml=req.session.firstname +" "+ req.session.lastname;
    var tt = req.body.title;
    var fnn = req.body.textarea1;
    var peep = req.session.email;
    var data2 = {
        title: tt,
        content: fnn,
        useremail: peep,
        name: ml


    }

    
    
    console.log(fnn);
    console.log(tt);
    console.log(peep);
    db.collection('news').insertOne(data2,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 
    res.render('postnews', { Account: req.session.email});

}) 
app.get('/postnews',function(req,res){ 
    const haris = req.session;
    console.log(req.session.email);
    res.render('postnews', { Account: req.session.email});


    })
    app.get('/tvshows',function(req,res){ 
        
        if(i==1){
            db.collection('Shows').find({}).toArray(function(err, docs) {
                if(err) throw err;
                 res.render('tvshows', {'docs':docs , 'Account': req.session.name});
                });
    
        }else if(i==0){
            db.collection('Shows').find({}).toArray(function(err, docs) {
                if(err) throw err;
                 res.render('tvshows2', {'docs':docs });
                });
        }
    
    
        })
        
        app.get('/profile',function(req,res){ 
            const haris = req.session;
            console.log(req.session.email);
            console.log(req.session.name);
            console.log(req.session.country);
            res.render('profile', { Account: req.session.name ,Email: req.session.email, Country: req.session.country, Pimage:req.session.pimage});
        
        
            })
    


app.get('/signup',function(req,res){ 
    console.log(req.url);

    res.sendFile(path.join(__dirname + '/signup.html'));

    })
    app.get('/login',function(req,res){ 
        console.log(req.url);
    
        res.sendFile(path.join(__dirname + '/login.html'));
        
    
        })
        app.get('/logout',function(req,res){
            i=0;
            console.log("yahan tu aaya tha");
            delete req.session;
            res.redirect('/login');
        })
        app.get('/mylist',function(req,res){
            db.collection('details').findOne({ email: req.session.email }, function(err, collection2){
                var array=collection2.id;
                if(array!=null){
                    db.collection('Shows').find({id: { $in: array } }).toArray(function(err, docs) {
                        if(err) throw err;
                         res.render('mylist', {'docs':docs , 'Account': req.session.name});
                        });

                }else{
                    res.render('tvshowsfornull', { 'Account': req.session.name});
                }
                

            });
            
            
        });
        app.post('/endpoint2', function(req, res){
            res.redirect('/logout');
            
            
        });        
        app.post('/endpoint', function(req, res){
            var obj = {};
            console.log('body: ' + JSON.stringify(req.body));
            console.log(req.body.title);
            show=req.body.title;
            db.collection('Shows').findOne({ title: show }, function(err, collection){
                if(err){
                    console.log("Error Occured");
                    res.redirect('/tvshows');
                }else{
                    console.log("success");
                    if (collection!=null){
                        
                            console.log("right details");
                            showsid=collection.id;
                            var check=1;
                            console.log(showsid);
                            
                            var myquery = { email: req.session.email };
                            var newvalues = {$addToSet: {
                                id: showsid
                              }};
                            
                            db.collection("details").updateOne(myquery, newvalues, function(err, res) {
                                if (err) throw err;
                                console.log("1 document updated");
                                
                            });
                            db.collection('Shows').find({}).toArray(function(err, docs) {
                                if(err) throw err;
                                 res.render('tvshows2', {'docs':docs });
                                });
            
                       
        
                    }else{
                        console.log("Invalid Show");
                        db.collection('Shows').find({}).toArray(function(err, docs) {
                            if(err) throw err;
                             res.render('tvshows2', {'docs':docs });
                            });
                    }
                    
                    
                    
                }
            })
            res.send(req.body);
        });
    
app.get('/',function(req,res){ 
    console.log(req.url);

    if(i==1){
        res.render('home', { Account: req.session.name});

    }else if(i==0){
        res.sendFile(path.join(__dirname + '/Bootstrapwebbb.html'));
    }
    
     

    }).listen(3000) 


