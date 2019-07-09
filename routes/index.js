var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");


// landing page
router.get("/",function(req,res){
	res.render("landing");
}); 

// Auth Routes

//  Render To Sign Up Page 
router.get("/register",function(req,res){
	res.render("register");
});
// handling user sign up
router.post("/register",function(req,res){
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			// console.log(err);
			req.flash("error",err.message);
			res.redirect("/register");
		}
		else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success", "Welcome to yelpcamp " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

// show login form
router.get("/login",function(req,res){
	res.render("login");
});
// login logic
// middleware
router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	successFlash: "Welcome!",
	failureRedirect: "/login",
	failureFlash: true
}) , function(req,res){
});

// logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
});

// middleware

module.exports = router;