const mongoose = require('mongoose');

// check if we have a valid number of args
const len = process.argv.length;
if (len != 3 && len != 5) {
  console.log('incorrect number of arguments');
  process.exit(1);
}

// generate and connect to URL
const password = process.argv[2];
const url =
  `mongodb+srv://jeremy:${password}@cluster0.diunbrl.mongodb.net/PhonebookApp?retryWrites=true&w=majority`;
mongoose.set('strictQuery',false);
mongoose.connect(url);

// define schema for a person
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

// if len is 3, we print each database item
if (len == 3) {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`); 
    });
    mongoose.connection.close();
  });
}
// else, len is 5, so we add new person to database
else {
  const inputName = process.argv[3];
  const inputNumber = process.argv[4];

  const person = new Person({
    name: inputName,
    number: inputNumber,
  });

  person.save().then(() => {
    console.log(`added ${inputName} number ${inputNumber} to phonebook`);
    mongoose.connection.close();
  });
}