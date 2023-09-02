const config = require("./config");
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: config.PORT });

function connectionHandle(ws) {
  let stateProtocol = neededFirstMessage;
  let interval;

  function neededFirstMessage(data) {
    let clientMessage;
    try {
      clientMessage = JSON.parse(data);
    } catch (e) {
      console.log(e.message);
    }
    switch (clientMessage.type) {
      case 'first_request':
        interval = setInterval(
        //interval = setTimeout(
          () => sendEvents(ws), 
          60000
          //3000
        );
        sendReferenceTable(ws);
        stateProtocol = null;
        break;
      default:
        console.log("unknown type into protocol");
      }
  }
  
  function messageHandle(data) {
    stateProtocol(data);
	}

  function closeHandle() {
  	clearInterval(interval);
  }

  ws.on('message', messageHandle);
	ws.on('close', closeHandle);
  ws.on('error', console.error);
}

wss.on('connection', connectionHandle);

function generateReferenceTable() {
  let referenceTable = [];
  let id;
  let name;
  let msg = {};

  msg["type"] = 'reference_table';
  for (let i = 0; i < 10; i++) {
    referenceTable.push({id: i, name: 'param_' + i});
  }
  msg["referenceTable"] = referenceTable;
  console.log("ReferenceTable: ", JSON.stringify(msg, null, 2));
  return msg;
}

function sendReferenceTable(connection) {
  const message = generateReferenceTable();
  //console.log(messageString);
  sendJSON(connection, message);
}

function generateEvents() {
  let monitoringResult = [];
  let id;
  let value;
  let msg = {};

  msg["type"] = 'monitoring_result';
  for (let i = 0; i < 10; i++) {
    monitoringResult.push({id: i, value: Math.floor(Math.random() * 50)});
  }
  msg["monitoringResult"] = monitoringResult;
  console.log("Event: ", JSON.stringify(msg, null, 2));
  return msg;
}

function sendEvents(connection) {
  const message = generateEvents();
  //console.log(messageString);
  sendJSON(connection, message);
}

function sendJSON(connection, obj) {
  obj["id"] = config.ID;
  const messageString = JSON.stringify(obj);
  connection.send(messageString);
}
