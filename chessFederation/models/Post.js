var mogoose = require('mongoose');

var PostSchema = new mogoose.Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments:[{type: mogoose.Schema.Types.ObjectId, ref: 'Comment'}]
});
PostSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

mogoose.model('Post', PostSchema);