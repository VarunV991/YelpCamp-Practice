var Campground=require("../models/campground");
var Comment=require("../models/comments");

var middlewareObj={};

middlewareObj.checkCampPermission=function(req,res,next){
    //is the user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash("error","Campground not found");
            res.redirect("/campgrounds"); 
        }
        else{
            //does the user own the camp
            if(foundCamp.author.id.equals(req.user.id)){
                next();
            }
            else{
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
                } 
            }
        })
    }
    else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentPermission=function(req,res,next){
    //is the user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds"); 
        }
        else{
            //does the user own the camp
            if(foundComment.author.id.equals(req.user.id)){
                next();
            }
            else{
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
                } 
            }
        })
    }
    else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");  //it will not display the message
    res.redirect("/login");
}


module.exports=middlewareObj;