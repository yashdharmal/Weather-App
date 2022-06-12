const express = require("express");
const { write } = require("fs");
const { STATUS_CODES } = require("http");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apikey = "525d33e8bf55c9440a5c95c23cf09c88";
  const unit = "matric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apikey +
    "&units=" +
    unit +
    "";
  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      let temp1 = weatherData.main.temp;
      const temp = Math.round((temp1 - 273.15) * 100) / 100;
      const weatherDiscription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>the weather is currently " + weatherDiscription + " </p>");
      res.write(
        "<h1>The temprature in " +
          query +
          " currently is " +
          temp +
          " degrees Celcius</h1>"
      );
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
