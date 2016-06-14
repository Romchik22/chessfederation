var express = require('express');
var router = express.Router();
var postsController = require("../Post/PostController.js");
var commentController = require("../Comment/CommentController.js");
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty:'payload'});
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.param('post', function(req, res, next, id){
    var query = Post.findById(id);
    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('can\'t find post'));
        }
        req.post = post;
        return next();
    });
});

router.param('comment', function (req, res, next, id) {
    var query = Comment.findById(id);
    query.exec(function (err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error('can\'t find comment'));
        }
        req.comment = comment;
        return next();
    });
});

router.get('/', postsController.getPosts);

router.post('/addpost', auth, function (req, res, next) {
    //payload


    if (req.payload.role == "moderator") {
        req.body.status = "accepted";
        postsController.savePost(req, res, next);
    }
    if (req.payload.role == "publisher") {
        req.body.status = "inProgress";
        postsController.savePost(req, res, next);
    }

});

router.get('/suggestedposts', postsController.getPendingPost);

router.delete('/suggestedposts/:post', postsController.removePost);

router.patch('/suggestedposts/:post', postsController.approvePost);

router.get('/suggestedposts/edit/:post', postsController.getPost);

router.patch('/suggestedposts/edit/:post', postsController.saveChange);

router.patch('/suggestedposts/:post', postsController.approvePost);

router.get('/:post', postsController.getPost);

router.put('/:post/upvote', auth, postsController.upvote);

router.post('/:post/comments', auth, commentController.addComment);

router.get('/:post/comments/:comment', commentController.getComment);

router.delete('/:post/comments/:comment', commentController.deleteComment);

router.put('/:post/comments/:comment/upvote', auth, commentController.upvoteComment);

module.exports = router;
