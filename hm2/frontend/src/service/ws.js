//const WS = new WebSocket('ws://localhost:8080');
//export default WS;

export default function useWS() {
  const initWS = () => {
    const ws = new WebSocket('ws://'+location.hostname+':8080');

    ws.onopen = () => {
      console.log('websocket client connected')
    }

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      console.log(JSON.stringify(msg));
      
      switch (msg.type) {
        case 'session_id':
          let sessionID = msg.sessionID
          console.log('sessionID arrived: ', sessionID);
          //controls = createControls();
          //console.log('controls: ', controls);
          //sendControls(controls, 'http://'+location.hostname+':8081/api/controls/');
          break;
        //case 'monitoring_result':
          //validateValues(msg.monitoringResult);
          //break;
        default:
          //console.log("wrong arrived data: ", JSON.stringify(msg));
          alert(JSON.stringify(msg));
      }
      
    }

    ws.onclose = (ev) => {
      console.log(ev);
    }

    ws.onerror = (ev) => {
      console.log(ev);
    }
  }
  return {
    initWS
  }
}
