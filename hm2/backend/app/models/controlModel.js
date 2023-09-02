const pool = require("./db.js");

const Control = function(control) {
  this.controlValues = [control.description, control.type];
  this.rulesValues = [];
  for(r of control.rules){
    this.rulesValues.push([control.description, ...Object.values(r)]); 
  }
};

Control.create = (newControl, result) => {
  pool.getConnection(function(err, conn) {
    conn.beginTransaction(function(err) {
      if (err) {
        connection.rollback(function() {
          conn.release();
          console.log("begin transaction error: ", err);
          result(err, null);
          return;
        });
      } else {
        conn.query("INSERT INTO controls(description, type) VALUES(?, ?)", newControl.controlValues, (err, res) => {
          if (err) { 
            conn.rollback(function() {
              conn.release();
              console.log("first insert error: ", err);
              result(err, null);
              return;
            });
          } else {
            conn.query("INSERT INTO rules(control_id, param_id, check_low_param, low_alarm_value, check_high_param, high_alarm_value) VALUES ?", [newControl.rulesValues], (err, res) => {
              if (err) {
                conn.rollback(function() {
                  conn.release();
                  console.log("second insert error: ", err);
                  result(err, null);
                });
              } else {
                conn.commit(function(err) {
                  if (err) {
                    conn.rollback(function() {
                      conn.release();
                      console.log("commit error: ", err);
                      result(err, null);
                    });
                  } else {
                    conn.release();
                    console.log("created control: ", { "Status": "Success" });
                    result(null, { "Status": "Success" });
                    return;
                  } // success commit
                }); // end commit
              } // success second insert
            }); // end second insert
          } // success first insert
        }); // end first insert
      } // success begin transaction
    }); // end begin transaction
  }); // end pool connection
}; // end create


Control.getAll = (result) => {
  pool.query("SELECT * FROM controls", (err, controls) => {
    if (err) {
      console.log("error from select controls: ", err);
      result(err, null);
      return;
    } else {
      for(let i = 0; i < controls.length; i++) {
        ((current) => {
          pool.query("SELECT * FROM rules WHERE rules.control_id='"+controls[current].description+"'", (err, rules) => {
            if (err) {
              console.log("error from select rules: ", err);
              result(err, null);
              return;
            } else {
              controls[current].rules=rules;
              //console.log("Controls: ", JSON.stringify(controls, null, 2));
              if (i == controls.length - 1) {
                result(null, JSON.stringify(controls));
              }
            }
          });
        }) (i);
      }
    }
  });
};

module.exports = Control;
