var express = require("express");
var axios = require("axios");
var moment = require("moment");
var app = express();

const token =
  "b4852c73abee95c3be632ac78e2edaa71cf95d7dba41ee6a267164645fd6b630";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
const employeeId = "570562";

app.get("/", function(req, res) {
  res.send("Hello World!");
});

// app.get("/currentroster", async function(req, res) {
//   console.log(req.query);
//   const rosterInfo = await axios
//     .get("https://my.tanda.co/api/v2/rosters/current?show_costs=true")
//     .then(response => response.data)
//     .catch(err => {
//       //silently fail like a ninja
//     });
//   res.json({
//     messages: [
//       {
//         text: `Current roster starts on ${rosterInfo.start} and finishes on ${
//           rosterInfo.finish
//         }`
//       },
//       {
//         text: `There are ${
//           rosterInfo.schedules.length
//         } schedules on this roster at a cost of ${rosterInfo.cost}`
//       }
//     ]
//   });
// });

app.get("/mynextschedule", async function(req, res) {
  console.log(req.query);
  const today = moment().format("YYYY-MM-DD");
  const sevenDaysFromToday = moment()
    .add(7, "days")
    .format("YYYY-MM-DD");
  const scheduleInfo = await axios
    .get(
      `https://my.tanda.co/api/v2/schedules?user_ids=${employeeId}&from=${today}&to=${sevenDaysFromToday}&show_costs=true&include_names=false`
    )
    .then(response => response.data)
    .catch(err => {
      //silently fail like a ninja
    });
  const nextShiftStart = moment(scheduleInfo[0].start * 1000).utc();
  const nextShiftFinish = moment(scheduleInfo[0].finish * 1000).utc();
  console.log(nextShiftStart.utcOffset());
  res.json({
    messages: [
      {
        text: `Your next shift is on ${nextShiftStart.format(
          "dddd"
        )} from ${nextShiftStart.format("h:mma")} to ${nextShiftFinish.format(
          "h:mma"
        )}`
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});
