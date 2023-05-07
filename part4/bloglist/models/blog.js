// schema for blog document in database

const mongoose = require('mongoose');

// schema for a blog
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
// edit toJSON function of schema, _id --> id, delete _id and __v
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// export model to be used in blog controller
module.exports = mongoose.model('Blog', blogSchema);
