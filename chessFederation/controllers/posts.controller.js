var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

module.exports = {
    // Get /posts
    getPosts: function (req, res, next) {
        Post.find(function (err, posts) {
            if (err) {
                return next(err);
            }
            res.json(posts);
        });
    },

    // Post /posts
    savePost: function (req, res, next) {
        var post = new Post(req.body);
        // post.author = req.payload.username;
        post.save(function (err, post) {
            if (err) {
                return next(err);
            }
            res.json(post);
        });
    },

    // Get /posts/:post
    getPost: function (req, res, next) {
        // Todo Use the populate() function to retrieve comments along with posts
        // req.post.populate('comments', function (err, post) {
        //   if(err){return next(err);}
        //
        //   res.json(post);
        // });
        res.json(req.post);
    },

    // Put /posts/:post/upvote
    upvote: function (req, res, next) {
        req.post.upvote(function (err, post) {
            // todo Investigate err handling
            if (err) {
                throw err;
            }

            res.json(post);
        });
    },

    // todo think about creating comment controller
    addComment: function (req, res, next) {
        var comment = new Comment(req.body);
        comment.post = req.post;
        comment.author = req.payload.username;

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

    // Put /posts/:post/comments/:comment/upvote
    upvoteComment: function (req, res, next) {
        req.comment.upvote(function (err, comment) {
            // todo Investigate err handling
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    }
};