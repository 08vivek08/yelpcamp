var express = require("express");
var router = express.Router({mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

// Comments New form
router.get("/new", middleware.isLoggedIn ,function(req,res){
	Campground.findOne({ _id: req.params.id },function(err,foundCamp){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{camp : foundCamp});
		}
	});
});
// Comments Create
router.post("/", middleware.isLoggedIn ,function(req,res){
	// lookup campground by using ID
	Campground.findOne({ _id: req.params.id },function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			// create new comment
			// console.log(req.body.comment);
			// console.log(campground);
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error", "Comment not found");
					console.log(err);
				}
				else{
					var d= new Date();
					comment.date=d;
					// add username and id to comment
						// console.log(req.user);
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					// save comment
					comment.save();
					// connect new comment to campground
					campground.comments.push(comment);
					// console.log(comment);
					campground.save();
					// redirect to show page
					req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

// COMMENTS EDIT
// /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
	Comment.findOne({ _id: req.params.comment_id },function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit",{ camp_id: req.params.id , comment: foundComment });
		}
	});
});
// COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwner,function(req,res){
	Comment.findOneAndUpdate({ _id: req.params.comment_id },req.body.comment,function(err,UpdatedComment){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			var d= new Date();
			UpdatedComment.date=d;
			UpdatedComment.save();
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
// COMMENT DELETE
router.delete("/:comment_id",middleware.checkCampDelOwner,function(req,res){
	Comment.findOneAndDelete({ _id: req.params.comment_id },function(err){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// middleware

module.exports = router;