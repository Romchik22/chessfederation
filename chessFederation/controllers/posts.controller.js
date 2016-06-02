var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
module.exports = {
    // Get /posts
    getPosts: function (req, res, next) {
        Post.find({status:"accepted"},function (err, posts) {
            if (err) {
                return next(err);
            }
            res.json(posts);
        });
    },
    
    getPandingPost: function (req, res, next) {
        Post.find({status:"inProgress"},function (err, posts) {
            if (err) {
                return next(err);
            }
            res.json(posts);
        });
    },
    
    // Post /posts
    savePost: function (req, res, next) {
        var post = new Post(req.body);
        post.author = req.payload.username;
        post.createdAt = new Date().getTime();
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
    },
    // delete /posts/suggestedposts/:post
    removePost: function (req, res, next) {
        Post.find({id: ObjectId(req.params.post)}).remove(afterRemove);
        function afterRemove(err) {
            if (err) {
                //    todo investigate exception handler
                console.log("error while deleting post");
            }
            next(req, res);
        }
    }
};