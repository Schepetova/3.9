import { ref } from 'vue'

export default function useEmulateEvent() {
  const errors = ref('');
  const baseURL = 'http://'+location.hostname+':8081/api';

  const createEvent = async (data) => {
    await sendRequest('validate','POST', data);
  }

  const sendRequest = async (endPoint, method, data) => {
    let isPostType;
    if (method === 'POST') isPostType = true;
    let opts = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        ...(isPostType && {body : JSON.stringify(data)})
    };
    //console.log("PostRequest opts: ", opts, method);
    errors.value = '';
    try {
      const response = await fetch(`${baseURL}/${endPoint}`, opts);
      if (!response.ok) {
        //console.log("PostRequest error: ", response.statusText);
        const rt = await response.text();
        //console.log("PostRequest error: ", rt);
        //throw new Error(response.statusText);
        throw new Error(rt);
      }
      const result = await response.json();
      return result;
    } catch(e) {
      //console.log(e);
      errors.value = e;
    }
  }
 
  return {
    errors,
    createEvent
  }
}
