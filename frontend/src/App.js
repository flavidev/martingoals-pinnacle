import React, { useState, useEffect } from "react";
import api from "./services/api";

import Match from "./components/Match";
import Loader from "react-loader-spinner";

import "./App.css";

function App() {
  const initialDeposit = 77.46;

  const [balance, setBalance] = useState();
  const [openBet, setOpenBet] = useState();
  const [underGoals, setUnderGoals] = useState(2.5);
  const [overGoals, setOverGoals] = useState(2.5);
  const [targetOdd, setTargetOdd] = useState(1.9);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get("balance").then((response) => {
      setBalance(response.data.availableBalance);
      setOpenBet(response.data.outstandingTransactions);
    });
  }, []);

  function handleReset() {
    setUnderGoals(2.5);
    setOverGoals(2.5);
    setTargetOdd(1.9);
    setMatches([]);
  }

  function handleSearch() {
    setIsLoading(true),
      api
        .get(`matches/${targetOdd}/${underGoals}/${overGoals}`)
        .then((response) => {
          //console.log("Target odd is " + targetOdd);
          //console.log(response.data);
          setMatches(response.data);
          setIsLoading(false);
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
          {!isLoading ? (
            <ul>
              {matches.map((match) => (
                <Match
                  key={match.id}
                  starts={match.starts}
                  odd={match.odd}
                  home={match.home}
                  away={match.away}
                />
              ))}
            </ul>
          ) : (
            <Loader
              type="BallTriangle"
              color="#00adb5"
              height={100}
              width={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
