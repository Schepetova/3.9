module.exports = app => {
  const controls = require("../controllers/controlController.js");

  var router = require("express").Router();

  // Create a new Control
  router.post("/", controls.create);

  // Retrieve all Controls
  router.get("/", controls.findAll);

  app.use('/api/controls', router);
};
