const pool = require("./db.js");

const Params = function(params) {
  //console.log("params from model: ", params);
  this.paramsValues = [];
  for(p of params.params){
    this.paramsValues.push([...Object.values(p)]); 
  }
  //console.log("params values in model out of create func: ", this.paramsValues);
};

Params.create = (newParams, result) => {
  //console.log("params values in model into of create func: ", newParams);
  pool.query("INSERT IGNORE INTO params (id, name) VALUES ?", [newParams.paramsValues], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //console.log("created params: ", { "Status": "Success" });
    //console.log("created params: ", res);
    result(null, { "Status": "Success" });
  });
};

Params.getAll = (result) => {
  //console.log("params values in model into of getAll func");
  let query = "SELECT * FROM params";
  pool.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("params: ", res);
    result(null, res);
  });
};

module.exports = Params;
