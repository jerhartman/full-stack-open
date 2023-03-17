// App.js for anecdotes

import { useState } from 'react'

// Button component
const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  );
}

// component to display numver of votes for an anecdote
const DisplayVotes = ({numVotes}) => {
  return (
    <p>votes: {numVotes}</p>
  );
}

// component to display anecdote with most votes
const MostVotes = ({anecdotes, votes}) => {
  const maxIndex = votes.indexOf(Math.max(...votes));
  return (
    <div>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[maxIndex]}</p>
      <DisplayVotes numVotes={votes[maxIndex]}/>
    </div>
  );
}

// App component 
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  // random integer generator
  const randomInt = (len) => Math.floor(Math.random() * (len));

  // initialize selected and votes
  const numAnecdotes = anecdotes.length;
  const [selected, setSelected] = useState(randomInt(numAnecdotes));
  const [votes, setVotes] = useState(new Array(numAnecdotes).fill(0));

  // call when button is clicked for next anecdote
  const nextAnecdoteClick = (len) => {
    let nextInt = randomInt(len);
    console.log('next anecdote:', nextInt);
    setSelected(nextInt);
  }

  // call when vote button is clicked for anecdote
  const voteClick = (selected, votes) => {
    const votesCopy = [...votes];
    votesCopy[selected] += 1;
    setVotes(votesCopy);
  }

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <Button handleClick={() => voteClick(selected, votes)} text='vote'/>
        <Button handleClick={() => nextAnecdoteClick(numAnecdotes)} text='next anecdote'/>
        <DisplayVotes numVotes={votes[selected]}/>
      </div>
      <MostVotes anecdotes={anecdotes} votes={votes}/>
    </>
  );
}

export default App;