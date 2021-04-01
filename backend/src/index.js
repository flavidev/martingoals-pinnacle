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
  underGoals: null,
  overGoals: null,
  targetOdd: null,
  matches: [],
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
  marketData.matches = [];
  let foundMatches = [];

  try {
    marketData.odds.leagues.forEach((league) =>
      //oddsData.leagues.forEach((league) =>
      league.events.forEach((event) =>
        foundMatches.push({
          matchId: event.id,
          totals: (event.periods[0].totals || []).filter(
            (value) =>
              (value.points === marketData.underGoals &&
                value.under >= marketData.targetOdd &&
                value.under < value.over) ||
              (value.points === marketData.overGoals &&
                value.over >= marketData.targetOdd &&
                value.over < value.under)
          ),
        })
      )
    );

    console.log("Analysing " + foundMatches.length + " matches.");

    foundMatches = foundMatches.filter((match) => match.totals.length > 0);

    console.log("Found " + foundMatches.length + " match(es)!");

    fixturesData.league.forEach((event) =>
      event.events.forEach((fixture) =>
        foundMatches.map((match) =>
          match.matchId === fixture.id
            ? marketData.matches.push({
                id: fixture.id,
                starts: fixture.starts,
                goals: match.totals[0].points,

                odd:
                  match.totals[0].over < match.totals[0].under
                    ? "Over " +
                      match.totals[0].points +
                      " Goals - " +
                      match.totals[0].over
                    : "Under " +
                      match.totals[0].points +
                      " Goals - " +
                      match.totals[0].under,

                home: fixture.home,
                away: fixture.away,
              })
            : null
        )
      )
    );

    marketData.matches.sort((a, b) => new Date(a.starts) - new Date(b.starts));

    console.log(marketData.matches);
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
  await getSoccerId();
  await getFixtures();
  await getOdds();
  await findMatches();
  res.send(JSON.stringify(marketData.matches));
});

app.listen(3333, () => {
  console.log("Server started...⚡️");
});
