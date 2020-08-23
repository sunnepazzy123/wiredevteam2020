const express = require("express");
const router  = express.Router();
const {userAuthenticated} = require('../../helpers/authethication');
const faker = require('faker');
const Post = require("../../models/Post");
const Comment = require("../../models/Comments");
const Category = require("../../models/Category");




// userAuthenticated,

router.all("/*",  (req, res, next)=>{

    req.app.locals.layout = "admin";
    next();


});


router.get("/", (req, res)=>{

    Post.countDocuments().then(postCount=>{
        Comment.countDocuments().then(commentCount=>{

            Category.countDocuments().then(categoryCount=>{
                res.render("admin/index", {postCount: postCount, commentCount, categoryCount });

            });
                
            


        });
        
    });

});

router.post('/generate-fake-posts', (req, res)=>{


    for(let i = 0; i < req.body.amount; i++){

        let post = new Post();

        post.user = req.user.id;
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComment = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.slug = faker.name.title();
        post.save(function(err){

            if (err) throw err;

        });

    }

    res.redirect('/admin/posts');

});


// router.get("/posts", (req, res)=>{
//     res.render("admin/posts");
//     // res.send("hello")
// });


// router.get("/create-posts", (req, res)=>{
//     res.render("admin/posts/create");
// })


// router.get("/dashboard", (req, res)=>{
//     res.render("admin/dashboard");
// });

// router.get("/blog_post", (req, res)=>{
//     res.render("home/blog_post");
// });


// router.get("/about", (req, res)=>{
//     res.render("home/about");
// });



module.exports = router;