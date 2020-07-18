const express = require("express");
const router = express.Router({mergeParams: true});
const Post = require("../models/post");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// New comment form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            res.render("comment/new", {post: post});
        }
    });
});

// POST new comment
router.post("/", middleware.isLoggedIn, function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/posts");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    res.redirect("/posts")
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash("success", "New comment saved!");
                    res.redirect("/posts/" + post._id);
                }
            });
        }
    });
});

// Update Comment
router.put("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id)
        }
    });
});

// Edit Comment form
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function (req, res) {
    Post.findById(req.params.id, function (err, editPost) {
        if (err || editPost) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/posts");
        } else {
            Comment.findById(req.params.comment_id, function (err, editComment) {
                if (err || !editComment) {
                    console.log(err);
                    res.redirect("/posts");
                } else {
                    res.render("comment/edit", {post: editPost, comment: editComment});
                }
            });
        }
    });
});

// Delete Comment
router.delete("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back")
        } else {
            req.flash("error", "Comment deleted!");
            res.redirect("/posts/" + req.params.id);
        }
    });
});

module.exports = router;