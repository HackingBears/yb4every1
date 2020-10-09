import axios from 'axios';

export default class GameInfoService {

  constructor() {
    
  }

  async getGameState() {
      const res = await axios.get('https://ybhackathon-service.apps.openshift.ims.ch/coffee');
      console.log('Gameinfo: ' + res.data);
  }

  async registerUser(){
    axios.post('https://jsonplaceholder.typicode.com/posts').then(res => {
        console.log(`Status code: ${res.status}`)
        console.log(`Status text: ${res.statusText}`);
        console.log(`Request method: ${res.request.method}`);
        console.log(`Path: ${res.request.path}`);

        console.log(`Date: ${res.headers.date}`);
        console.log(`Data: ${res.data}`);
    });
  }

}
