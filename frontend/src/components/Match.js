import React from "react";
import "./Match.css";

function Match(props) {
  let date = new Date(Date.now()).toString();

  return (
    <div className="match-container">
      <li>
        {" "}
        {props.date} - {props.time} - {props.odd} - {props.goals} - {props.home}{" "}
        vs {props.away}
      </li>
    </div>
  );
}

export default Match;
