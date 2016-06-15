var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
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
    
    // Get /posts/sugestedposts
    getPendingPost: function (req, res, next) {
        Post.find({status:"inProgress"},function (err, posts) {
            if (err) {
                return next(err);
            }
            res.json(posts);
        });
    },

    // patch /posts/suggestedposts/:post
    approvePost: function (req, res, next) {
        Post.findByIdAndUpdate(req.params.post, { status: 'accepted' } , function (err) {
            if (err) {
                res.send(err);
            }
            console.log('status changed');
            res.send(200);
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
         req.post.populate('comments', function (err, post) {
          if(err){return next(err);}
        
           res.json(post);
         });
        
    },

    // Put /posts/:post/upvote
    upvote: function (req, res, next) {
        req.post.upvote(function (err, post) {
            if (err) {
               return next(err);
            }

            res.json(post);
        });
    },
    
    // delete /posts/suggestedposts/:post
    removePost: function (req, res, next) {
        Post.findByIdAndRemove(req.params.post, function (err) {
            if (err) {
                return next(err);
            }
            console.log('Post deleted!');
            res.send(200);
        });
    },

    // patch /posts/suggestedposts/edit/:post
    saveChange: function (req, res, next) {

        var post = new Post(req.body);
        
        Post.findByIdAndUpdate(req.params.post,{ title: post.title, body: post.body }  ,function (err) {
            if (err) {
                return next(err);
            }
            console.log('Post Update!');
            res.send(200);
        });
    }
};