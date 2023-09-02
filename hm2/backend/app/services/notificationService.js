const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });

let connections = {};
//let sessionID;

exports.initNotificationService = () => {
  //wss.on('connection', (ws, req) {
  wss.on('connection', function connection(ws, req) {
    let sessionID = req.headers['sec-websocket-key'];
    console.log('sec-websocket-key: ', sessionID);
    connections[sessionID] = ws;
    let msg = {};
    msg["type"] = 'session_id';
    msg["sessionID"] = sessionID;
    ws.send(JSON.stringify(msg));

    messageHandle = data => {}
    closeHandle = () => {
      delete[sessionID];
    }
    ws.on('message', messageHandle);
    ws.on('close', closeHandle);
    ws.on('error', console.error);
  });
};

exports.sendToAll = (data) => {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(data));
  })
}

exports.ifSessionExist = (sessionID) => {
  if (sessionID in connections) {
    console.log('check session: ',JSON.stringify(connections))
    return true;
  }
  //return connections[sessionID];
}

//exports.getWS = (sessionID) => {
//  return connections[sessionID];
//}

exports.sendToNeighborhood = (me, data) => {
  for (const [session, ws] of Object.entries(connections)) {
    if (ws !== connections[me]) {
      ws.send(JSON.stringify(data));
    }
  }
}



/*
function generateEvents() {
  msg["type"] = 'monitoring_result';
  msg["monitoringResult"] = monitoringResult;
  console.log("Event: ", JSON.stringify(msg, null, 2));
  let messageString = JSON.stringify(msg);
  return messageString;
}

function sendJSON(connection, obj) {
  obj["id"] = config.ID;
  const messageString = JSON.stringify(obj);
  connection.send(messageString);
}

function sendEvents(connection) {
  let messageString = generateEvents();
  //console.log(messageString);
  connection.send(messageString);
}
*/
