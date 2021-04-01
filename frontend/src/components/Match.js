import React from "react";
import "./Match.css";

function Match(props) {
  let date = new Date(Date.now()).toString();

  return (
    <div className="match-container">
      <li>
        {" "}
        {props.starts.slice(8, 10)}/{props.starts.slice(5, 7)}/
        {props.starts.slice(0, 4)} - {props.starts.slice(11, 19)} - {props.odd}{" "}
        - {props.home} vs {props.away}
      </li>
    </div>
  );
}

export default Match;
