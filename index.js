//import express module 
var express = require('express');
//create  an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

//set the view engine to ejs
app.set('view engine','ejs');
//set the directory of views
app.set('views','./views');
//specify the path of static directory
app.use(express.static(__dirname + '/public')); 
// app.use(express.static(path.join(__dirname, 'STUDENTHOMEWORK')));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(flash()); 
app.use(bodyParser.urlencoded({ extended: true })); 
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cpe_273_secure_string',
    resave: false,
    saveUninitialized: true
  }));

//Only user allowed is admin
var Users = [{
    "username" : "admin",
    "password" : "admin"
}];
//For students to get store
var students = []
var message="";
//route to root
app.get('/',function(req,res){
    //check if user session exits
    if(req.session.user){
        res.render('adduser');
    }else
        res.render('login');
});
// Inorder to post the login page 
app.post('/login',function(req,res){
    if(req.session.user){
        res.render('adduser');
    }else{
        console.log("Inside Login Post Request");
        console.log("Req Body : ", req.body);
        Users.filter(function(user){
            if(user.username === req.body.username && user.password === req.body.password){
                req.session.user = user;
                console.log("User successfully loggedin");
                res.redirect('/adduser');
            }
        })
    }
});
// Inorder to post the adduser
app.post('/adduser',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        var index = students.map(function(student){
            return student.StudentId;
         }).indexOf(req.body.studentId); 
         if(index==-1)
         {
            var newStudent = {Name: req.body.name, StudentId: req.body.studentId, Department : req.body.department};
            students.push(newStudent);
            console.log(students);
            res.redirect('/userreport');
            console.log("User Added Successfully!!!!");
         }
         else{
             console.log("Student with that id already exists");
            message= "Please enter the valid id ,Id already taken";
             res.render('adduser',{message: message});
         }
        }
});
// inoder to get the adduser
app.get('/adduser',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log("Session data : " , req.session);
        res.render('adduser');
    }
    
});
// get the userreport 
app.get('/userreport',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log("Session data : " , req.session);
        res.render('userreport',{
            students : students
        });
    }
    
});


// app.get('/delete',function(req,res){
//     console.log("Session Data : ", req.session.user);
//     if(!req.session.user){
//         res.redirect('/');
//     }else
//         res.render('delete');
// });
/*app.get('/adduser',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        res.render('adduser');
    }
    
});*/

/*app.post('/adduser',function(req,res){
    console.log("Inside Delete Request");
    var index = students.map(function(student){
        return student.StudentId;
     }).indexOf(req.body.table); 
     
     if(index === -1){
        console.log("User Not Found");
     } else {
        students.splice(index, 1);
        console.log("Student : " + req.body.table+ " was removed successfully");
        res.redirect('/adduser');
     }
})*/
// Inorder to delete the user record
app.get('/deleteuser/:id',function(req,res){
    console.log("Inside Delete Request");
    var index = students.map(function(student){
        return student.StudentId;
     }).indexOf(req.params.id); 
     
     if(index === -1){
        console.log("User Not Found");
     } else {
        students.splice(index, 1);
        console.log("Student : " + req.params.id+ " was removed successfully");
        res.redirect('/userreport');
     }
})

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
 
});