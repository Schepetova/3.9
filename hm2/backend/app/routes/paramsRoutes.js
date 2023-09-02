module.exports = app => {
  const params = require("../controllers/paramsController.js");

  var router = require("express").Router();

  // Create a new Params
  router.post("/", params.create);

  // Retrieve Ref table
  router.get("/", params.findAll);
 
  app.use('/api/params', router);
};
