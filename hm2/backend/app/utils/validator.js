exports.validate = (monitoringResult, controls) => {
  //console.log("START checking monitoringResult");
  let outputs = [];
  const currentSensorMap = makeSensorIDtoValueStore(monitoringResult);
  //console.log(currentSensorsMap);
  //console.log(monitoringResult);
  for (const control of controls) {
    //console.log(control);
    let badComplexComplete = 0;
   
    try {
      if ( control.rules.length === undefined) {
        //console.log("No length!!!!!!", control);
        //debugger;
      }
    } catch(e) {
      console.log("Wrong JSON structure from DB. Ignore.");//, e);
      //console.log("from e!!!!!!!!!!!!", control);
      return false;
    }

    for(let i = 0; i < control.rules.length; i++) {
      //console.log('control type: ', control.type);
      if (!checkInput(control.rules[i])) break;
      if (control.type === 'discrete') {
        if (!checkRule(control.rules[i], currentSensorMap)) {
          outputs.push(control.description);
          break;
        } else {
          break;
        }
      } else if (control.type === 'complex') {
        if (!checkRule(control.rules[i], currentSensorMap)) {
          badComplexComplete++;
          if (badComplexComplete === control.rules.length) {
            outputs.push(control.description);
            break;
          }
        continue;
        }
      } else {
        console.log('corrupt JSON structure!');
        throw new Error('corrupt JSON structure!');
      }
    }
  }
  return outputs;
  //showAlert(outputs);
  //console.log("END checking monitoringResult");
}

checkRule = (rule, sensorMap) => {
  //console.log('map: ', sensorMap[rule.param_id]);
  // bad rule
  if (rule.check_low_param && rule.check_high_param) {
    if (sensorMap[rule.param_id] < rule.low_alarm_value || sensorMap[rule.param_id] > rule.high_alarm_value) return false;
  } else if (rule.check_low_param && !rule.check_high_param) {
    if (sensorMap[rule.param_id] < rule.low_alarm_value) return false;
  } else if (!rule.check_low_param && rule.check_high_param) {
    if (sensorMap[rule.param_id] > rule.high_alarm_value) return false;
  }
  // good rule
  return true;
}

checkInput = (rule) => {
  if (!rule.check_low_param && !rule.check_high_param) {
    console.log('Input error: empty rule!');
    return false;
  } else if (rule.low_alarm_value > rule.high_alarm_value) {
    console.log('Input error: inverse diapasone!');
    return false;
  }
  return true;
}

makeSensorIDtoValueStore = (monitoringResult) => {
  try {
    let store = {};
    for (let i = 0; i < monitoringResult.length; i++) {
      let key = monitoringResult[i].id;
      let value = monitoringResult[i].value;

      if (key in store) {
        //console.log('key in store');
        throw new Error('Duplicate sensor ID');
      } else {
        //console.log('key, value: ', key, value);
        store[key] = value;
      }
    }
    //console.log('store: ', store);
    return store;
  } catch(e) {
    throw new Error(e);
  }
}

showAlert = (outputs) => {
  /*
  items = [];
  for(o of outputs){
    items.push(...Object.values(o)); 
  }
  console.log("Output message: ", JSON.stringify(items));
  //alert(JSON.stringify(items));
  */
  console.log("Output message: ", outputs);
}
