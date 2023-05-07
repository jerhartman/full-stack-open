// schema for user document in database

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// schema for a user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // check with imported validator
    minLength: 3
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
});
userSchema.plugin(uniqueValidator);
// edit toJSON function of schema, _id --> id, delete _id, __v, and passwordHash
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

// export model to be used in user controller
module.exports = mongoose.model('User', userSchema);
