var express = require("express");
var axios = require("axios");
var app = express();

const token =
  "b4852c73abee95c3be632ac78e2edaa71cf95d7dba41ee6a267164645fd6b630";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.get("/currentroster", async function(req, res) {
  const rosterInfo = await axios
    .get("https://my.tanda.co/api/v2/rosters/current?show_costs=true")
    .then(response => response.data)
    .catch(err => {
      //silently fail like a ninja
    });
  res.json({
    messages: [
      {
        text: `Current roster starts on ${rosterInfo.start} and finishes on ${
          rosterInfo.finish
        }`
      },
      {
        text: `There are ${rosterInfo} schedules on this roster at a cost of ${
          rosterInfo.cost
        }`
      }
    ]
  });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
