module.exports = app => {
  const testAlgo = require("../controllers/testAlgoController.js");

  var router = require("express").Router();

  // Invoke all chains for validate algo test.
  router.post("/", testAlgo.invoke);

  app.use('/api/validate', router);
};
