var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require ("./multer");
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  console.log(req.flash("error"));
  res.render('login', { error: req.flash("error") });
});


router.get('/feed', function(req, res, next) {
  res.render('feed', );
});

router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
  if (!req.file) {
    return res.status(400).send('No files were uploaded');
  }

  // If file uploaded, save it as a post and associate it with the user
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,  // Fix the typo here: 'iamge' to 'image'
    imageText: req.body.filecaption,
    user: user._id
  });

  // Push the post's ID to the user's posts array
  user.posts.push(post._id);

  // Save the updated user
  await user.save();

  res.send("done");
});




router.get('/profile', isLoggedIn, async  function(req, res, next) {
 const user = await userModel.findOne({
  username: req.session.passport.user
 })
  .populate("posts")
  console.log(user)
  res.render('profile', {user});
});

router.post("/register", (req,res)=>{
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName:req.body.fullName
  })

  
  userModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })


});

router.post("/login", passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true

}), function(req,res){

});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
