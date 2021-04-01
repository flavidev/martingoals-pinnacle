import React from "react";
import "./Match.css";

function Match(props) {
  let date = new Date(Date.now()).toString();

  return (
    <div className="match-container">
      <li>
        {" "}
        {props.starts} - {props.odd} - {props.home} vs {props.away}
      </li>
    </div>
  );
}

export default Match;
