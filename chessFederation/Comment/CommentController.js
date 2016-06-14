/**
 * Created by sobolrr on 14.06.16.
 */
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Schema = mongoose.Schema;
module.exports = {
    // Post posts/:post/comments
    addComment: function (req, res, next) {
        var comment = new Comment(req.body);
        comment.post = req.post;
        comment.author = req.payload.username;
        comment.createdAt = new Date().getTime();

        comment.save(function (err, comment) {
            if (err) {
                return next(err);
            }
            req.post.comments.push(comment);
            req.post.save(function (err, post) {
                if (err) {
                    return next(err);
                }
                res.json(comment);
            });
        });
    },

    // Get /posts/:post/comments/:comment
    getComment: function (req, res, next) {
        res.json(req.comment);
    },

    // delete /posts/:post/comments/:comment
    deleteComment: function (req, res, next) {
        Comment.findByIdAndRemove(req.params.comment, function (err) {
            if (err) {
                next(err);
                res.send(err);
            }
            req.post.populate('comments', function (err, post) {
                if(err){return next(err);}

                res.json(post);
            });
        });
    },

    // Put /posts/:post/comments/:comment/upvote
    upvoteComment: function (req, res, next) {
        req.comment.upvote(function (err, comment) {
            // todo Investigate err handling
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    },
};