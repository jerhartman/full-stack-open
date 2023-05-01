// App for phonebook

import { useState, useEffect } from 'react'
import services from './services/serverFuncs.js'

const Filter = ({filter, changeFunc}) => 
  <div>
    filter shown with <input value={filter} onChange={(e) => changeFunc(e.target.value)}/>
  </div>

const Form = ({name, nameFunc, number, numFunc, subFunc}) => 
  <form onSubmit={subFunc}>
    <div>
      name: <input value={name} onChange={(e) => nameFunc(e.target.value)}/>
    </div>
    <div>
      number: <input value={number} onChange={(e) => numFunc(e.target.value)}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Entry = ({person, persons, setPersons, setError, setNotification}) => {
  const handleDelete = (id) => {
    console.log('delete called');
    let conf = window.confirm(`delete ${person.name}?`);
    if(conf) {
      services
      .remove(id).then(deletedPerson => {
        console.log(`deleted person: ${deletedPerson}`);
        setPersons(persons.filter(p => p.id !== id));
        setNotification(`Removed ${person.name}`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      })
      .catch(error => {
        console.log(`cannot delete person: ${error}`)
        setError(`${person.name} has already been removed from server`);
        setTimeout(() => {
          setError(null);
        }, 5000);
        setPersons(persons.filter(p => p.id !== id));
      });
    }
  }
  return (
    <div>
      <p>{person.name} {person.number}</p>
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </div>
  )
}

const Numbers = ({persons, setPersons, setError, setNotification}) =>
  <div>
    {persons.map((person) => 
      <Entry key={person.name} person={person} persons={persons} setPersons={setPersons} setError={setError} setNotification={setNotification}/>
    )}
  </div>

const Notification = ({message}) => {
  const notifStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  let toReturn = !message ? 
    null :
    <div style={notifStyle}>
      {message}
    </div>
  return toReturn;
}

const Error = ({message}) => {
  const notifStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  let toReturn = !message ? 
    null :
    <div style={notifStyle}>
      {message}
    </div>
  return toReturn;
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    services
      .getAll().then(returnedPersons => {
        console.log('persons fetched');
        setPersons(returnedPersons);
      })
      .catch(error => {
        console.log(`cannot fetch persons: ${error}`);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dupeName = persons.some(person => person.name === newName);
    const entry = {
      name: newName,
      number: newNumber
    }
    if(!dupeName) {
      services
        .create(entry).then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotification(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          console.log(`cannot add person: ${error}`);
          setError(`Person validation failed. \'${newName}\' is shorter than the minimum allowed length (3)`);
          setTimeout(() => {
            setError(null);
          }, 5000);
        })
    }
    else {
      let conf = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);
      if(conf) {
        let updateId = persons.find(person => person.name === newName).id;
        services.update(updateId, entry).then(updatedPerson => {
          setPersons(persons.map(person => person.name !== newName ? person : updatedPerson));
          setNotification(`Updated ${updatedPerson.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          console.log(`cannot update person: ${error}`);
          setError(`Could not update ${newName} in the server`);
          setTimeout(() => {
            setError(null);
          }, 5000);
        })
      }
    }
    setNewName('');
    setNewNumber('');
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Error message={error}/>
      <Filter filter={newFilter} changeFunc={setNewFilter}/>
      <h2>add a new</h2>
      <Form name={newName} nameFunc={setNewName} number={newNumber} numFunc={setNewNumber} subFunc={handleSubmit}/>
      <h2>Numbers</h2>
      <Numbers persons={filteredPersons} setPersons={setPersons} setError={setError} setNotification={setNotification}/>
    </div>
  )
}

export default App