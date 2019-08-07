var express        =require("express"),
    bodyParser     =require("body-parser"),
    mongoose       =require("mongoose"),
    flash          =require("connect-flash"),
    app            =express(),
    passport       =require("passport"),
    LocalStrategy  =require("passport-local"),
    methodOverride =require("method-override"),
    User           =require("./models/user"),
    Campground     =require("./models/campground"),
    Comment        =require("./models/comments"),
    seedDB         =require("./seed")
    
    
var campgroundRoutes=require("./routes/campground");
var commentRoutes=require("./routes/comments");
var authRoutes=require("./routes/index");

//seedDB();

mongoose.connect("mongodb://localhost/yelp_campv12",{ useNewUrlParser: true });

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT 

app.use(require("express-session")({
    secret: "YelpCamp project Is awesome",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){                 //adding our own middleware so that currentUser is
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error")//passed to every route
    res.locals.success=req.flash("success");
    next();
})

app.use(campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(authRoutes);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


app.listen(3000,process.env.IP,function(){
    console.log("YelpCamp Server has Started");
})