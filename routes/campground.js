var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var middleware=require("../middleware"); //it will automatically look for index.js if not specified

//Display all the campgrounds
router.get("/campgrounds",function(req,res){
    Campground.find(function(err,camps){
        if(err){
            console.log("Oops");
        }
        else{
            res.render("campgrounds/index",{camps:camps , currentUser:req.user});
        }
    })
})


//Display add a new campground form
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
})

//Add a new campground
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var img=req.body.image;
    var price=req.body.price;
    var desc=req.body.description;
    var author={
        id: req.user.id,
        username: req.user.username
    }
    Campground.create({
        name: name,
        image: img,
        price: price,
        description:desc,
        author:author
    },
    function(err,camp){
        if(err){
            console.log("Oops");
        }
        else{
            console.log("Camp Added");
            res.redirect("/campgrounds");
        }
    });
})

//Display details of a single campground
router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log("Oops")
        }
        else{
            res.render("campgrounds/show",{camp:foundCamp});
        }
    })
})

//Edit Route
router.get("/campgrounds/:id/edit",middleware.checkCampPermission,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds"); 
        }
        else{
            res.render("campgrounds/edit",{camp:foundCamp});
        }    
    })
})

//Update Route
router.put("/campgrounds/:id",middleware.checkCampPermission,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.edit,function(err,updatedCamp){
        if(err){
            req.flash("error","Something went Wrong");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Campground Updated Successfully");
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})


//Destroy Route
router.delete("/campgrounds/:id",middleware.checkCampPermission,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Campground Deleted Successfully");
            res.redirect("/campgrounds")
        }
    })
})

module.exports=router;