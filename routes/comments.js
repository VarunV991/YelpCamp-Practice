var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var Comment=require("../models/comments");
var middleware=require("../middleware");

//Display new comment form
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash("error","Something went Wrong");
            console.log(err);
        }
        else{
            res.render("comments/new",{camp:foundCamp});
        }
    })
    
})

//Add a new comment
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            req.flash("error","Something went Wrong");
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went Wrong");
                }
                else{
                    comment.author.id=req.user.id;
                    comment.author.username=req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save(function(err,data){
                        if(err){
                            req.flash("error","Something went Wrong");
                        }
                        else{
                            req.flash("success","Comment Added Successfully");
                            res.redirect("/campgrounds/"+req.params.id);
                        }
                    })
                }
            })
        }
    })
})

//edit route
router.get("/:comment_id/edit",middleware.checkCommentPermission,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success","Comment Edited Successfully");
            res.render("comments/edit",{camp_id:req.params.id,comment:foundComment});
        }
    })
    
})

//update route
router.put("/:comment_id",middleware.checkCommentPermission,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,newComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success","Comment Updated Successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    }) 
})

//delete route
router.delete("/:comment_id",middleware.checkCommentPermission,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success","Comment Deleted Successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


module.exports=router;