const Validator = require("../utils/validator.js");
const CheckString = require("../utils/checkString.js");
const Control = require("../models/controlModel.js");
const NotificationService = require("../services/notificationService");

let isError = true;

// Controller for manually invoke test algorithm.
// Support extend validation by requirements.
exports.invoke = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
    isError = true;
  } else 
    if (!req.body.params || !req.body.id ) {
      return res.status(400).send({
        message: "Not allow empty values!"
      });
    isError = true;
  } else
    if (req.body.params.length !== 5) {
      return res.status(400).send({
        message: "No exactly 5 params!"
      });
    isError = true;
  } else {
    //console.log("array of params: ", req.body.params);
    for (const field of req.body.params) {
      //console.log("field and type of field: ", field.value , typeof(field.value));
      if (typeof(field.value) === "number") {
        //console.log("json field is valid numeric value originally: ", field.value);
        isError = false;
        continue;
      } else if (!CheckString.isNumeric(field.value)) {
        return res.status(400).send({
          message: "Not number in field!"
        });
        //console.log("json field not valid: ", field.value);
        isError = true;
        break;
      } else if (field.value === undefined) {
        //console.log("not suitable json structure!");
        return res.status(400).send({
          message: "Wrong json!"
        });
        isError = true;
        break;
      } else {
        isError = false;
        continue;
      }
    }
    //if (!isError) {
    //  res.status(200).send({message: "Ok"});
    //}
  }
  Control.getAll((err, controls) => {
    if (err) {
      console.log("Error on get controls:", err);
      return res.status(400).send({message: "Error on get controls!"});
    }
    else {
      //console.log("Controls retrived: ", controls);
      try {
        const result = Validator.validate(req.body.params, JSON.parse(controls));
        if (result?.length) {
          console.log(result);
          let msg = {};
          msg["type"] = 'alarm_controls';
          msg["id"] = req.body.id;
          msg["result"] = result;
          NotificationService.sendToAll(msg);
          return res.status(200).send({message: "Controls will be send."});
        } else {
          return res.status(200).send({message: "Empty controls."});
        }
      } catch(e) {
        return res.status(200).send({message: "Ignore incorrect checking situations."});
      }
    }
  });
}
