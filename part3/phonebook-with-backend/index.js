// index file for the phonebook backend

// import express, morgan, cors, and Person model
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

// create app using express
const app = express();

// create body token for morgan logs
morgan.token('body', (req) => JSON.stringify(req.body));

// use build/index.html when root is fetched
app.use(express.static('build'));

// use middleware to parse response json, log with morgan, and change origin policy with cors
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

// define error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  next(error);
};

// get request for all persons
app.get('/api/persons', (_request, response, next) => {
  console.log('get request for all persons');
  Person.find({}).then(people => {
    response.json(people);
  }).catch(error => next(error));
});

// get info page 
app.get('/info', (request, response, next) => {
  console.log('info get request');
  Person.find({}).then(people => {
    const len = people.length;
    const now = new Date();
    const text = `<p>Phonebook has info for ${len} people</p><p>${now}</p>`;
    response.send(text);
  }).catch(error => next(error));
});

// get individual person from database
app.get('/api/persons/:id', (request, response, next) => {
  let id = request.params.id;
  Person.findById(id).then(person => {
    if (!person) {
      return response.status(404).end();
    }
    response.json(person);
  }).catch(error => next(error));
});

// delete a person
app.delete('/api/persons/:id', (request, response, next) => {
  let id = request.params.id;
  Person.findByIdAndRemove(id).then(() => {
    response.status(204).end();
  }).catch(error => next(error));
});

// function to generate an new ID
// const generateID = () => Math.floor(Math.random() * 999999);

// add new person with random ID
app.post('/api/persons', (request, response, next) => {
  if (request.body === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  person.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(error => next(error));
});

// update a person's phone number 
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    }).catch(error => next(error));
});

// use errorHandler middleware
app.use(errorHandler);

// listen on port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});