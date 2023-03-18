// App for phonebook

import { useState } from 'react'

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

const Entry = ({person}) =>
  <p>{person.name} {person.number}</p>

const Numbers = ({persons}) =>
  <div>
    {persons.map((person) => 
      <Entry key={person.name} person={person}/>
    )}
  </div>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567', id: 1 } 
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const dupeName = persons.some(person => person.name === newName);
    const dupeNumber = persons.some(person => person.number === newNumber);
    if(!dupeName && !dupeNumber) {
      const entry = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(entry));
    }
    else {
      alert(`${newName} is already in the phonebook`);
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
      <Filter filter={newFilter} changeFunc={setNewFilter}/>
      <h2>add a new</h2>
      <Form name={newName} nameFunc={setNewName} number={newNumber} numFunc={setNewNumber} subFunc={handleSubmit}/>
      <h2>Numbers</h2>
      <Numbers persons={filteredPersons}/>
    </div>
  )
}

export default App