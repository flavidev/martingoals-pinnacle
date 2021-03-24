import React, { useState, useEffect } from "react";
import api from "./services/api";

import Match from "./components/Match";

import "./App.css";

function App() {
  const initialDeposit = 100;

  const [balance, setBalance] = useState();
  const [openBet, setOpenBet] = useState();
  const [underGoals, setUnderGoals] = useState(2.5);
  const [overGoals, setOverGoals] = useState(2.5);
  const [targetOdd, setTargetOdd] = useState(1.85);
  const [matches, setMatches] = useState([
    {
      id: Math.random(),
      date: "24/03/2020",
      time: "21:35",
      goals: "Over 2.5",
      odd: "1.8",
      home: "Flamengo",
      away: "Botafogo",
    },
    {
      id: Math.random(),
      date: "25/03/2020",
      time: "20:00",
      goals: "Under 2.5",
      odd: "1.9",
      home: "Vasco",
      away: "Fluminense",
    },
  ]);

  useEffect(() => {
    api.get("balance").then((response) => {
      setBalance(response.data.availableBalance);
      setOpenBet(response.data.outstandingTransactions);
    });
  }, []);

  function handleReset() {
    setUnderGoals(2.5);
    setOverGoals(2.5);
    setTargetOdd(1.85);
  }

  function handleSearch() {
    api.get(`matches/${targetOdd}/${underGoals}/${overGoals}`).then((response) => {
      
      console.log("Target odd is " + response.data.targetOdd);
      // setMatches(response.data.matches)


    });
  }

  return (
    <div className="app">
      <h1>💰 Martingoals ⚽️</h1>
      <div className="main-dashboard">
        <table>
          <thead>
            <tr>
              <th>Balance 💵</th>
              <th>Open 🍀</th>
              <th>Result 📈</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>U$ {balance}</td>
              <td> U$ {openBet}</td>
              <td>
                {" U$ "}
                {Math.round((balance + openBet - initialDeposit) * 100) / 100}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="control-dashboard">
        <div className="control-panel">
          <h2>Over & Under</h2>
          <div>
            <input
              type="number"
              placeholder={targetOdd}
              value={targetOdd}
              step="0.01"
              onChange={(e) => setTargetOdd(e.target.value)}
            />
            <span>Minimum odd</span>
          </div>
          <div>
            <input
              type="number"
              placeholder={underGoals}
              step="0.25"
              value={underGoals}
              onChange={(e) => setUnderGoals(e.target.value)}
            />
            <span>Under</span>
          </div>
          <div>
            <input
              type="number"
              placeholder={overGoals}
              step="0.25"
              value={overGoals}
              onChange={(e) => setOverGoals(e.target.value)}
            />
            <span>Over</span>
          </div>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="result-panel">
          <ul>
            {matches.map((match) => (
              <Match
                key={match.id}
                date={match.date}
                time={match.time}
                odd={match.odd}
                goals={match.goals}
                home={match.home}
                away={match.away}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
