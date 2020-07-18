const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect(`/login?origin=${req.originalUrl}`);
}

middlewareObj.isAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin) {
            return next();
        } else {
            req.flash("error", "You aren't authorized for that!");
            res.redirect("/posts");
        }
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect(`/login?origin=${req.originalUrl}`);
}

middlewareObj.checkPostOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, function (err, editPost) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            } else {
                if (!editPost) {
                    req.flash("error", "Something went wrong!");
                    return res.redirect("back");
                }
                if (editPost.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You aren't authorized to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first!")
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, editComment) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            } else {
                if (!editComment) {
                    req.flash("error", "Something went wrong!");
                    return res.redirect("back");
                }
                if (editComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You aren't authorized to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first!")
        res.redirect("/login");
    }
}

module.exports = middlewareObj