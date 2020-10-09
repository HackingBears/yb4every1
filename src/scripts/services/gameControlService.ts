//import signalR from '@microsoft/signalr';
import * as signalR from "@microsoft/signalr"

const connection = new signalR.HubConnectionBuilder()
.withUrl("https://ybhackathon-service.apps.openshift.ims.ch/coffeehub")
.withAutomaticReconnect()
.configureLogging(signalR.LogLevel.Debug)
.build();

connection.on('UpdateOrderStateAsync', (bla) => { console.log('Test erfolgreich!') });

connection.on('UpdateGameFrame', (gameData) => {
    
});
connection.on('CompleteRegistration', (bla) => { console.log('Test erfolgreich!') });



export default class GameControlService {

  constructor() {

  }

  async setupConnection() {
    await connection.start();

    //let connection = new signalR.HubConnectionBuilder();
        /* .withUrl("https://ybhackathon-service.apps.openshift.ims.ch/coffeehub")
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();*/
  };

  async updateGameFrame(){

  }




//   async voteNextPlayMove(){
//     try {
    
//         await this.connection.start();
//         console.log("SignalR Connected.");
//     } catch (err) {
//         console.log(err);
//         setTimeout(start, 5000);
//     } 
//   }


}