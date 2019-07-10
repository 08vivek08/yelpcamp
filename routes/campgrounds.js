var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX	-	show all campgrounds
router.get("/",function(req,res){
	// Get all campgrounds from DB
	// console.log(req.user);
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index",{campgrounds: allCampgrounds});
		}
	});
});
// New 	-	show form to create new campground
router.get("/new", middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new");
});
// CREATE 	-	add new campground to Db
router.post("/", middleware.isLoggedIn ,function(req,res){
	// add data from the form
	var name=req.body.camp;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.desc;
	var author={
		id: req.user._id,
		username: req.user.username
	};
	var new_camp = {name: name, price:price, image: image, description: desc, author: author};
	// Create & save a new campground in DB
	Campground.create( new_camp,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			// redirect back to campground page
			// console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});
// SHOW 	-	 shows more info about one campground
router.get("/:id",function(req,res){
	// find the campground with provided ID
	var camp_id=req.params.id;
	Campground.findOne({_id: camp_id }).populate("comments").exec(function(err,camp){
		if(err){
			console.log(err);
		}
		else{
			// console.log(camp);
			// render show template with that campground
			var now = new Date();
			res.render("campgrounds/show",{camp: camp,now: now});
		}
	});
});
// EDIT 
router.get("/:id/edit", middleware.checkCampOwner ,function(req,res){
	Campground.findOne({_id: req.params.id},function(err,camp){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.render("campgrounds/edit",{camp: camp});	
		}
	});	
});
// UPDATE
router.put("/:id", middleware.checkCampOwner ,function(req,res){
	Campground.findOneAndUpdate({_id: req.params.id} ,req.body.campground,function(err,updatedCamp){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});
// DELETE
router.delete("/:id", middleware.checkCampOwner ,function(req,res){
	Campground.findOneAndDelete({_id: req.params.id },function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
})

// middleware


module.exports = router;