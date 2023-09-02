const Control = require("../models/controlModel.js");
const NotificationService = require("../services/notificationService");

// Create and Save a new Control
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  if (req.body.type === "discrete" && req.body.rules.length !== 1) {
    return res.status(400).send({
      message: "Not allow multiple rules in discrete control!"
    });
  }

  // Create a Control
  const control = new Control({
    description: req.body.description,
    type: req.body.type,
    rules: req.body.rules
  });

  // Save Control in the database
  Control.create(control, (err, data) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Control."
      });
    }
    else {
      if (!NotificationService.ifSessionExist(req.body.sessionID)) {
        return res.status(500).send({message: "Wrong SessionID!"});
      }
      let msg = {};
      msg["type"] = 'update_controls';
      NotificationService.sendToNeighborhood(req.body.sessionID, msg);
      return res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  //console.log("GET control hook:", JSON.stringify(req, null, 2));
  Control.getAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Controls."
      });
    }
    else { 
      //console.log(data);
      return res.send(data);
    }
  });
};
