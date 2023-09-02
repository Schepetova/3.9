const WebSocket = require('ws')
const config = require("../config/clientSocketConfig.js");
const Params = require("../models/paramsModel.js");
const Control = require("../models/controlModel.js");
const Validator = require("../utils/validator.js");
const NotificationService = require("../services/notificationService");
//const url = 'ws://localhost:8080'
const connection = new WebSocket(config.SENSOR_SERVICE_URL)

exports.initSensorServiceClient = () => {
  connection.onopen = () => {
    console.log('websocket connected')
    connection.send('{"type":"first_request"}');
  }

  connection.onclose = (ev) => {
    console.log(`WebSocket close: ${ev}`)
  }

  connection.onerror = (err) => {
    console.log(`WebSocket error: ${err}`)
  }

  connection.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    console.log(JSON.stringify(msg));
    switch (msg.type) {
      case 'reference_table':
        //console.log("Params from socket:", msg.referenceTable);
        const params = new Params({
          params: msg.referenceTable
        });
        Params.create(params, (err, data) => {
          if (err) {
            console.log("Error on save reference params table:", err);
          }
          else {
            //console.log("Params saved to DB:", data);
          }
        });
        break;
      case 'monitoring_result':
        Control.getAll((err, controls) => {
          if (err) {
            console.log("Error on get controls:", err);
          }
          else {
            //console.log("Controls retrived: ", controls);
            const result = Validator.validate(msg.monitoringResult, JSON.parse(controls));
            if (result?.length) {
              let data = {};
              data["type"] = 'alarm_controls';
              data["id"] = msg.id;
              data["result"] = result;
              NotificationService.sendToAll(data);
            }
            console.log(result);
          }
        });
        break;
      default:
        console.log("unknown data", JSON.stringify(msg));
    }
  }
}
