const Params = require("../models/paramsModel.js");

// Create and Save a new Params
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Params
  const params = new Params({
    params: req.body.params
  });
  console.log("params into controller outer of create func:", JSON.stringify(params, null, 2));
  
  // Save Params in the database
  Params.create(params, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Params."
      });
    }
    else { res.send(data); }
  });
};

exports.findAll = (req, res) => {
  //console.log("GET params hook:", JSON.stringify(req, null, 2));
  Params.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ref table."
      });
    else res.send(data);
  });
};
