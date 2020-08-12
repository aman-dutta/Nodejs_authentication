var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    localStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user');


mongoose.connect("mongodb://localhost/node_auth", {useNewUrlParser: true});
mongoose.connection
    .once("open", () => console.log("Connected"))  //If connection is successful
    .on("eror", error => {                          //If any error occurs
        console.log("Your Error: ",error);
});

app.set('view engine', 'ejs');

app.use(require("express-session")({
    secret: "I love you, Mom",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());       //Encoding
passport.deserializeUser(User.deserializeUser());   //Decoding

//==========
// ROUTES
app.get("/",function(res,res){
    res.render('home');
});

app.get("/secret",isLoggedIn,function(req,res){
    res.render('secret');
});


//Auth Routes

app.get('/register',function(req,res){
    res.render('register');
});

//handling user sign up
app.post('/register',function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect('/secret');
        });
    });
});

//LOGIN ROUTES
//render login form
app.get('/login',function(req,res){
    res.render('login');
});
//login logic
app.post('/login',passport.authenticate("local", {
    successRedirect: '/secret',
    failureRedirect: '/login'
}),function(req,res){

});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000,function(){
    console.log("Matrimonial Server has started");
});