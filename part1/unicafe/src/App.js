// App.js defines all components used in this project

import { useState } from 'react'

// button component
const Button = ({text, handleClick}) => (
    <button onClick={handleClick}>{text}</button>
  );

// display output component
const StatisticLine = ({text, count, percent}) => {
  let rounded = Number((count).toFixed(1));
  if(percent) {
    rounded += '%';
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{rounded}</td>
    </tr>
  );
}

// container component for stat lines
const Statistics = ({counts}) => {
  let [good, neutral, bad, all, avg, pos] = counts;
  if(!all) {
    return(
      <p>No feedback given</p>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text='good' count={good}/>
        <StatisticLine text='neutral' count={neutral}/>
        <StatisticLine text='bad' count={bad}/>
        <StatisticLine text='all' count={all}/>
        <StatisticLine text='average' count={avg}/>
        <StatisticLine text='positive' count={pos} percent={true}/>
      </tbody>
    </table>
  );
}

// main app component
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [avg, setAgv] = useState(0);
  const [pos, setPos] = useState(0);

  // update the average after a click
  const updateAvg = (good, bad, all) => {
    let newAvg = (good - bad) / all;
    setAgv(newAvg);
  }

  // update positive percentage after click
  const updatePos = (good, all) => {
    let newPos = (good / all) * 100;
    setPos(newPos);
  }

  // based on rating, update counter and stats
  const ratingClick = (rating) => {
    // temp variables to update stats
    let updatedGood = good;
    let updatedBad = bad;
    let updatedAll = all + 1;
    // we know a button was clicked, so inc all
    setAll(updatedAll);
    // check which button was clicked and inc value
    switch(rating) {
      case 'good':
        updatedGood += 1;
        setGood(updatedGood);
        break;
      case 'neutral':
        setNeutral(neutral + 1);
        break;
      default:
        updatedBad += 1;
        setBad(updatedBad);
    }
    // update stats
    updateAvg(updatedGood, updatedBad, updatedAll);
    updatePos(updatedGood, updatedAll);
  }

  let counts = [good, neutral, bad, all, avg, pos];

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button text='good' handleClick={() => ratingClick('good')}/>
        <Button text='neutral' handleClick={() => ratingClick('neutral')}/>
        <Button text='bad' handleClick={() => ratingClick('bad')}/>
      </div>
      <h2>statistics</h2>
      <Statistics counts={counts}/>
    </div>
  )
}

export default App