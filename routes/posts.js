const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const middleware = require("../middleware");

//INDEX to show all posts
router.get("/", function (req, res) {
    Post.find({}, function (err, allPosts) {
        if (err) {
            console.log(err);
            req.flash("error", err);
            res.redirect("/posts");
        } else {
            res.render("post/index", {posts: allPosts})
        }
    })
});

//CREATE add a post to database
router.post("/", middleware.isLoggedIn, middleware.isAdmin, function (req, res) {
    const title = req.body.title;
    const body = req.sanitize(req.body.body);
    const author = {
        id:req.user._id,
        username:req.user.username
    }
    const newPost = {title:title, body:body, author:author};
    Post.create(newPost, function (err) {
        if (err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/posts");
        } else {
            req.flash("success", "New post created!")
            res.redirect("/posts");
        }
    })
});

//NEW to show form to create post
router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function (req, res) {
    res.render("post/new")
});

router.get("/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, requestedPost){
        if (err || !requestedPost) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            return res.redirect("/posts");
        } else {
            res.render("post/show", {post: requestedPost})
        }
    });
});

// Edit Post form
router.get("/:id/edit", middleware.isLoggedIn, middleware.isAdmin, middleware.checkPostOwnership, function (req, res) {
    Post.findById(req.params.id, function (err, editPost) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/posts");
        } else {
            res.render("post/edit", {post: editPost});
        }
    });
});

// Update Post
router.put("/:id", middleware.isLoggedIn, middleware.isAdmin, middleware.checkPostOwnership, function (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, updatedPost) {
        if (err || !updatedPost){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/posts");
        } else {
            req.flash("success", "Post updated!");
            res.redirect("/posts/" + req.params.id)
        }
    });
});

// Delete Post
router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, middleware.checkPostOwnership, function (req, res) {
    Post.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/posts/" + req.params.id)
        } else {
            req.flash("error", "Post deleted!");
            res.redirect("/posts");
        }
    });
});

module.exports = router;