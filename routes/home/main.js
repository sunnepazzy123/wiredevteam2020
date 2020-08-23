const express = require("express");
const router  = express.Router();


const Post  = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all("/*", (req, res, next)=>{

    req.app.locals.layout = "home";
    next();


});


router.get("/", (req, res)=>{

    // req.session.edwin = "edwin";

    // req.session.edwin ? console.log("we found it"): console.log("we found notin");
    
    Post.find({})
    .populate({path: "user", model: "users"})
    // .populate("user")
    .limit(4)
    .then(posts=>{

        res.render("home/index" , {posts: posts});


    

    });


});

router.get('/logout', (req, res)=>{


    req.logOut();
    res.redirect('/login');

});


router.get("/forgot_password", (req, res)=>{
    res.render("home/forgot_password")
})





router.get("/login", (req, res)=>{
    res.render("home/login")
});
//APP LOGIN

passport.use(new LocalStrategy({usernameField: "email"}, (email, password,done)=>{

    User.findOne({email: email}).then(user=>{
        
        if(!user) return done(null, false, {message: "no user found"});
        
        bcrypt.compare(password, user.password, (err,matched)=>{
            if(err) return err;

            if(matched){
                return done(null, user);
                // console.log(user)
            }else{
                return done(null, false, {message: "Incorrect Password"})
                console.log(user)

            }
        });

        // console.log(user)
    })



}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});








router.post("/login", (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/login",
        failureFlash: true
    })(req,res, next);

});

router.get("/register", (req, res)=>{
    res.render("home/register")
})

router.post("/register", (req, res)=>{


    let errors = [];


    if(!req.body.firstName) {

        errors.push({message: 'please add a First Name'});

    }


    if(!req.body.lastName) {

        errors.push({message: 'please add a Last Name'});

    }

    if(!req.body.email) {

        errors.push({message: 'please add an Email'});

    }

    if(!req.body.password) {

        errors.push({message: 'please enter a password'});

    }


    if(!req.body.passwordConfirm) {

        errors.push({message: 'This field cannot be blank'});

    }


    if(req.body.password !== req.body.passwordConfirm) {

        errors.push({message: "Password fields don't match"});

    }


    if(errors.length > 0){

        res.render('home/register', {

            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        });

    } else {


        User.findOne({email: req.body.email}).then(user=>{

            if(!user){

                const newUser = new User({

                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,

                });



                bcrypt.genSalt(10, (err, salt)=>{

                    bcrypt.hash(newUser.password, salt, (err, hash)=>{


                        newUser.password = hash;


                        newUser.save().then(savedUser=>{


                            req.flash('success_message', 'You are now registered, please login')


                            res.redirect('/login');

                        });


                    })


                });

            } else {

                req.flash('error_message', 'That email exist please login');


                res.redirect('/register');


            }


        });

   



    }

   
});

router.get("/blog", (req, res)=>{

    const perPage = 10;
    const page = req.query.page || 1;

    Post.find({})
    .skip( (perPage * page) - perPage )
    .limit(perPage)
    .then(posts=>{

        Category.find({}).then(categories=>{

            Post.find({}).limit(3).then(postLimit=>{
            Post.countDocuments().then(postCount=>{
     
            res.render('home/blog', {
                categories: categories,
                posts: posts,
                postLimit: postLimit,
                current: parseInt(page),
                pages: Math.ceil(postCount / perPage)
              
              });

            });


            });

    
        });


    });


});

router.post("/search",(req,res)=>{
    
    // console.log(req.body.search);
    const perPage = 10;
    const page = req.query.page || 1;

    const search = req.body.search;

    Post.find({ tags: {$regex: search}})
      
        .then(tags=>{
            Category.find({}).then(categories=>{
    
                Post.find({}).limit(3).then(postLimit=>{
                Post.countDocuments().then(postCount=>{
         
                res.render('home/blog_search', {
                    categories: categories,
                    postLimit: postLimit,
                    current: parseInt(page),
                    pages: Math.ceil(postCount / perPage),
                    tags: tags,
                    postCount: postCount
                  
                  });
    
                });
    
    
                });
    
        
            });




        });









});








router.get("/blog_post/:slug", (req, res)=>{

    // res.render("home/blog_single/");
    Post.findOne({slug: req.params.slug})
        .populate({path: "comments", match: {approveComment: true} ,populate: {path: "user", model: "users"}})
        .populate("user")
        .then(post=>{
           
            // console.log(post.user)
            Category.find({}).then(categories=>{

                
            Post.find({}).limit(5).then(postLimits=>{


            //     // User.findById({_id: post.user}).then(postUser=>{
                    res.render('home/blog_post', {post: post, categories: categories, postLimits: postLimits});

                // })

              

            });


            });//categories
          
        });// then
   
    
});



router.get("/contact", (req, res)=>{
    res.render("home/contact");
});

router.get("/services", (req, res)=>{
    res.render("home/services");
});

router.get("/portfolio-work", (req, res)=>{
    res.render("home/portfolio-work");
});

router.get("/work_details", (req, res)=>{
    res.render("home/work_details");
});

router.get("/about", (req, res)=>{
    res.render("home/about");
});



router.post('/register', (req, res)=>{

    let errors = [];


    if(!req.body.firstName) {

        errors.push({message: 'please enter your first name'});

    }


    if(!req.body.lastName) {

        errors.push({message: 'please add a last name'});

    }

    if(!req.body.email) {

        errors.push({message: 'please add an email'});

    }

    if(!req.body.password) {

        errors.push({message: 'please enter a password'});

    }


    if(!req.body.passwordConfirm) {

        errors.push({message: 'This field cannot be blank'});

    }


    if(req.body.password !== req.body.passwordConfirm) {

        errors.push({message: "Password fields don't match"});

    }


    if(errors.length > 0){

        res.render('home/register', {

            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        })

    } else {


        User.findOne({email: req.body.email}).then(user=>{

            if(!user){

                const newUser = new User({

                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,

                });



                bcrypt.genSalt(10, (err, salt)=>{

                    bcrypt.hash(newUser.password, salt, (err, hash)=>{


                        newUser.password = hash;

                        //code block

                        newUser.save().then(savedUser=>{


                            req.flash('success_message', 'You are now registered, please login')


                            res.redirect('/login');

                        });


                    })


                });

                
                newUser.save().then(savedUser=>{


                    req.flash('success_message', 'You are now registered, please login')


                    res.redirect('/login');

                });

            } else {

                req.flash('error_message', 'That email exist please login');


                res.redirect('/login');


            }


        });




    }


});







module.exports = router;