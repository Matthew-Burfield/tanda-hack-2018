var express = require("express");
var axios = require("axios");
var moment = require("moment");
var app = express();

const token =
  "b4852c73abee95c3be632ac78e2edaa71cf95d7dba41ee6a267164645fd6b630";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
const employeeId = "570562";

const employees = {
  ["293746592843659284"]: {
    employeeId: "",
    employeeName: "Matt"
  }
};

// employees[req.params["messenger user id"]].employeeId

app.get("/mynextschedule", async function(req, res) {
  console.log(req.params["messenger user id"]);
  console.log(req.params);
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
  const nextShiftStart = moment(scheduleInfo[0].start * 1000).utcOffset(600);
  const nextShiftFinish = moment(scheduleInfo[0].finish * 1000).utcOffset(600);
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

app.get("/myshiftsforthisweek", async function(req, res) {
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
  let text = "";
  if (scheduleInfo.length === 0) {
    text = "Aww man, you've got no shifts this week :(";
  } else {
    text = scheduleInfo.reduce((string, shift) => {
      const start = moment(shift.start * 1000).utcOffset(600);
      const finish = moment(shift.finish * 1000).utcOffset(600);
      return (
        string +
        `${moment(start).format("dddd")}: ${moment(start).format(
          "h:mma"
        )} - ${moment(finish).format("h:mma")}\n`
      );
    }, "Yo! Your shifts this week are:\n");
    text = text.slice(0, -1);
  }
  res.json({
    messages: [
      {
        text
      }
    ]
  });
});

app.get("/howmuchamigettingpaid", async function(req, res) {
  // req.param['messenger user id'];
  const mondayThisWeek = moment()
    .isoWeekday(1)
    .format("YYYY-MM-DD");
  const sundayThisWeek = moment()
    .isoWeekday(7)
    .format("YYYY-MM-DD");
  const scheduleInfo = await axios
    .get(
      `https://my.tanda.co/api/v2/schedules?user_ids=${employeeId}&from=${mondayThisWeek}&to=${sundayThisWeek}&show_costs=true&include_names=false`
    )
    .then(response => response.data)
    .catch(err => {
      //silently fail like a ninja
    });
  const payThisWeek = scheduleInfo.reduce((total, schedule) => {
    return total + schedule.cost;
  }, 0);
  res.json({
    messages: [
      {
        text: `Based on your rostered schedule this week, you\'re going to be paid $${Math.round(
          payThisWeek * 100
        ) / 100}!`
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});
