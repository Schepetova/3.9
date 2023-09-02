import { ref } from 'vue'

export default function useControls() {
  const controls = ref([]);
  const error = ref('');
  const baseURL = 'http://'+location.hostname+':8081/api';

  const getControls = async () => {
    console.log("getControl start")
    const params = await sendRequest('params','GET');
    //console.log('params: ', params);
    const paramsMap = makeParamsIDtoNameStore(params);
    //console.log("params values: ", paramsMap);

    let rawControls = await sendRequest('controls','GET');
    for (let control of rawControls) {
      //console.log(control.rules);
      for(let i = 0; i < control.rules.length; i++) {
        if (control.rules[i].check_low_param === 1) {
          control.rules[i].check_low_param = 'yes';
        } else {
          control.rules[i].check_low_param = 'no';
        }
        control.rules[i].check_high_param = control.rules[i].check_high_param == 1 ? 'yes' : 'no';
        control.rules[i].param_id = paramsMap[control.rules[i].param_id];
      }
    }
    //console.log(rawControls);
    controls.value = {...rawControls};
    console.log("getControl end")
  }

  const makeParamsIDtoNameStore = (referenceTable) => {
    try {
      let store = {};
      for (let i = 0; i < referenceTable.length; i++) {
        let key = referenceTable[i].id;
        let value = referenceTable[i].name;

        if (key in store) {
          //console.log('key in store');
          throw new Error('Duplicate key!');
        } else {
          //console.log('key, value: ', key, value);
          store[key] = value;
        }
      }
      //console.log('store: ', store);
      return store;
    } catch(e) {
      console.log(e);
    }
  }

  const createControl = async (data) => {
    controls.value = await sendRequest('controls','POST', data);
  }
  
  const getReferenceTable = async (data) => {
    referenceTable.value = await sendRequest('params','GET');
  }
 
  const sendRequest = async (endPoint, method, body) => {
    let// opts = {};
      opts = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
      };
    /*
    if (method === 'GET') {
      opts = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
      };
    } else {
    */
    if (method === 'POST') {
      opts = {
        //method: method,
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };
    }
    //console.log("opts: ", opts)

    try {
      //console.log("post data: ", opts.body)
      const response = await fetch(`${baseURL}/${endPoint}`, opts);
      const result = await response.json();
      //console.log(result);
      return result;
    } catch(e) {
      console.log(e);
      error.value = e; 
      //alert(error);
    }
  }
 
  return {
    controls,
    error,
    getControls,
    createControl,
    getReferenceTable
  }
}
