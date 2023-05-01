// index file for the phonebook backend

// import express, morgan, cors, and Person model
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

// create app using express
const app = express();

// create body token for morgan logs
morgan.token('body', (req) => JSON.stringify(req.body));

// use build/index.html when root is fetched
app.use(express.static('build'))

// use middleware to parse response json, log with morgan, and change origin policy with cors
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

// persons pre-loaded into phone book
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// get request for all persons
app.get('/api/persons', (request, response) => {
  console.log('get request for all persons');
  Person.find({}).then(people => {
    response.json(people);
  }).catch(error => {
    console.log('could not fetch all persons:', error.message);
    return response.status(400).json({ error: 'content missing' })
  })
});

// get info page 
app.get('/info', (request, response) => {
  console.log('info get request');
  Person.find({}).then(people => {
    const len = people.length
    const now = new Date();
    const text = `<p>Phonebook has info for ${len} people</p><p>${now}</p>`
    response.send(text);
  }).catch(error => {
    console.log('internal server error:', error.message);
    response.status(500).end();
  })
});

// get individual person from database
app.get('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  Person.findById(id).then(person => {
    if (!person) {
      return response.status(404).end();
    }
    response.json(person)
  }).catch(error => {
    console.log(error);
    response.status(400).send({ error: 'malformatted id' })
  })
})

// delete a person
app.delete('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  Person.findByIdAndRemove(id).then(result => {
    response.status(204).end();
  }).catch(error => {
    console.log('internal server error:', error.message);
    response.status(500).end();
  });
});

// function to generate an new ID
// const generateID = () => Math.floor(Math.random() * 999999);

// add new person with random ID
app.post('/api/persons', (request, response) => {
  if (request.body === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  person.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(error => {
    console.log('internal server error:', error.message);
    response.status(500).end();
  })
});

// update a person's phone number 
app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    }).catch(error => {
      console.log('internal server error:', error.message);
      response.status(500).end();
    });
});

// listen on port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});