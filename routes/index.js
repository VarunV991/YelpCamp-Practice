var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var User=require("../models/user");
var passport=require("passport");

//starting page
router.get("/",function(req,res){
    res.render("landing");
})

//Display new user register form
router.get("/register",function(req,res){
    res.render("register");
})

//Register new user
router.post("/register",function(req,res){
    var newUser=new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        })
    })
})

//Display login page
router.get("/login",function(req,res){
    res.render("login");
})

//Login the user
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
})

//Logout operation
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged Out Successfully!");
    res.redirect("/campgrounds");
})


module.exports=router;
