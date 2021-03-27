const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config({ path: __dirname + "/.env" });

const oddsData = require("./mockData/OddsData.json");
const fixturesData = require("./mockData/FixturesData.json");

const app = express();
app.use(cors());
app.use(express.json());

let marketData = {
  soccerId: null,
  fixtures: {},
  odds: {},
  balance: {},
  underGoals: 2.5,
  overGoals: 2.5,
  targetOdd: null,
  matches: [
    {
      id: Math.random(),
      date: "24/03/2020",
      time: "21:35",
      goals: "Over 2.5",
      odd: 1.8,
      home: "Team A",
      away: "Team B",
    },
    {
      id: Math.random(),
      date: "25/03/2020",
      time: "20:00",
      goals: "Under 2.5",
      odd: 1.9,
      home: "Team C",
      away: "Team D",
    },
  ],
};

const getBalance = async () => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.pinnacle.com/v1/client/balance",
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });
    marketData.balance = response.data;
    //console.log(marketData.balance);
  } catch (err) {
    console.log(err);
  }
};

const getSoccerId = async () => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.pinnacle.com/v2/sports",
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });
    response.data.sports.filter((sport) => {
      if (sport.name === "Soccer") {
        marketData.soccerId = sport.id;
        console.log(`Soccer id is ${marketData.soccerId}`);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getFixtures = async () => {
  try {
    const response = await axios({
      method: "get",
      url: `https://api.pinnacle.com/v1/fixtures?sportId=${marketData.soccerId}`,
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });
    marketData.fixtures = response.data;
    console.log("Soccer fixtures have been updated 🗓");
  } catch (err) {
    console.log(err);
  }
};

const getOdds = async () => {
  try {
    const response = await axios({
      method: "get",
      url: `https://api.pinnacle.com/v1/odds?sportId=${marketData.soccerId}&oddsFormat=DECIMAL`,
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });
    marketData.odds = response.data;
    console.log("Soccer odds have been updated 📈");
  } catch (err) {
    console.log(err);
  }
};

const findMatches = async () => {
  let foundMatches = [];

  try {
    oddsData.leagues.forEach((league) =>
      league.events.forEach((event) =>
        foundMatches.push({
          matchId: event.id,
          totals: (event.periods[0].totals || []).filter(
            (value) =>
              (value.points === marketData.underGoals ||
                value.points === marketData.overGoals) &&
              ((value.over >= marketData.targetOdd &&
                value.over < value.under) ||
                (value.under >= marketData.targetOdd &&
                  value.under < value.over))
          ),
        })
      )
    );

    console.log(foundMatches.length);

    foundMatches = foundMatches.filter((match) => match.totals.length > 0);

    console.log(foundMatches.length);
  } catch (err) {
    console.log("Found error... " + err);
  }
};

app.get("/balance", async (req, res) => {
  await getBalance();
  res.send(JSON.stringify(marketData.balance));
});

app.get("/matches/:targetOdd/:underGoals/:overGoals", async (req, res) => {
  marketData.targetOdd = parseFloat(req.params.targetOdd);
  marketData.overGoals = parseFloat(req.params.overGoals);
  marketData.underGoals = parseFloat(req.params.underGoals);
  //await getSoccerId();
  //await getFixtures();
  //await getOdds();
  await findMatches();
  res.send(JSON.stringify(marketData.matches));
});

app.listen(3333, () => {
  console.log("Server started...⚡️");
});
