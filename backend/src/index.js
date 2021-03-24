const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
app.use(cors());
app.use(express.json());

let marketData = {
  soccerId: null,
  fixtures: {},
  odds: {},
  balance: {},
  underGoals:null,
  overGoals:null,
  targetOdd:null,
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
    console.log("Soccer fixtures have been updated 🗓")
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
    console.log("Soccer odds have been updated 📈")
  } catch (err) {
    console.log(err);
  }
};

const findMatches = async (underGoals, overGoals, minimumOdd) => {
  // Do something
};

app.get("/balance", async (req, res) => {
  await getBalance();
  res.send(JSON.stringify(marketData.balance));
});

app.get("/matches/:targetOdd/:underGoals/:overGoals", async (req, res) => {
  await getSoccerId();
  await getFixtures();
  await getOdds();
  //await findMatches();
  marketData.targetOdd = req.params.targetOdd
  marketData.overGoals = req.params.overGoals
  marketData.underGoals = req.params.underGoals
  res.send(JSON.stringify(marketData));
});

app.listen(3333, () => {
  console.log("Server started...⚡️");
});
