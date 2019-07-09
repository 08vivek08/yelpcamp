var Campground = require("../models/campground");
var Comment = require("../models/comments");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

middlewareObj.checkCampOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findOne({_id: req.params.id },function(err, foundCamp){
			if(err){
				req.flash("error", "Campground not found ");
				res.redirect("back");
			} else{
				// console.log(foundCamp.author.id);
				// console.log(req.user._id);
				if(foundCamp.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findOne({_id: req.params.comment_id},function(err,foundComment){
			if(err){
				req.flash("error", "Comment not found");
				res.redirect("back");
			}
			else{
				if(req.user._id.equals(foundComment.author.id)){
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCampDelOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findOne({_id: req.params.id },function(err, foundCamp){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else{
				// console.log(foundCamp.author.id);
				// console.log(req.user._id);
				if(foundCamp.author.id.equals(req.user._id)){
					next();
				} else{
					Comment.findOne({_id: req.params.comment_id},function(err,foundComment){
						if(err){
							req.flash("error", "Comment not found");
							res.redirect("back");
						}
						else{
							if(req.user._id.equals(foundComment.author.id)){
								next();
							}
							else{
								req.flash("error", "You don't have permission to do that");
								res.redirect("back");
							} 
						}
					});
				}
			}
		});
	} else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}



module.exports = middlewareObj ;