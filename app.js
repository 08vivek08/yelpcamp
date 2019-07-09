var express               = require("express"),
	app                   = express(),
	flash 				  = require("connect-flash-plus"),
	bodyParser            = require("body-parser"),
	mongoose              = require("mongoose"),
	passport              = require("passport"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride 		  = require("method-override"),
	User 				  = require("./models/user"),
	Campground            = require("./models/campground"),
	Comment               = require("./models/comments"),
	seedDb                = require("./seed");

// requiring routes .1
var indexRoutes		 = require("./routes/index"),
	campgroundRoutes = require("./routes/campgrounds"), 	
	commentRoutes 	 = require("./routes/comments");
	
// mongoose.connect("mongodb://localhost:27017/yelp_camp_v10Deployed",{ useNewUrlParser : true});
mongoose.connect("mongodb+srv://vivek:hellovivek@cluster1-lfoo8.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser : true});

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); 
app.set("view engine","ejs");


// ======================================
// PASPORT CONFIG
app.use(require("express-session")({
	secret: "Rusty is cute",
	// cookie: { maxAge: 60000 },
	resave: false ,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
// ======================================


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

var port = process.env.PORT || 5000;
app.listen(port,function(){
	console.log(`Campground server has started at ${port}`);
});

