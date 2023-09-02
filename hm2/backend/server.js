const express = require("express");
const SensorServiceClient = require('./app/services/sensorServiceClient.js')
const NotificationService = require('./app/services/notificationService.js')
const cors = require("cors");

SensorServiceClient.initSensorServiceClient();
NotificationService.initNotificationService();

const app = express();

//var corsOptions = {
//  origin: "http://localhost:8081"
//};
//app.use(cors(corsOptions));
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));

// simple route
//app.get("/", (req, res) => {
//  res.json({ message: "Welcome to bezkoder application." });
//});

require("./app/routes/paramsRoutes.js")(app);
require("./app/routes/controlRoutes.js")(app);
require("./app/routes/testAlgoRoutes.js")(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/ws.html');
})

// set port, listen for requests
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
