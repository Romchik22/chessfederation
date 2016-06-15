var mogoose = require('mongoose');

var PostSchema = new mogoose.Schema({
    title: String,
    body: String,
    status: String,
    author: String,
    createdAt: { type: Date, expires: 60*60*24 },
    upvotes: {type: Number, default: 0},
    comments:[{type: mogoose.Schema.Types.ObjectId, ref: 'Comment'}]
});
PostSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

mogoose.model('Post', PostSchema);