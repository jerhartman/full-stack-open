// person document for people collection of phonebook app
const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

const url = process.env.MONGODB_URI; // place URI in env to hide
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:' , error.message);
  });
// define schema for person
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String
});
// alter toJSON of schema to delete versioning and change id to string
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
// export Person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;