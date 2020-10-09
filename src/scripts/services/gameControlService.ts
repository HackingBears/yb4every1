import * as signalR from "@microsoft/signalr"

const connection = new signalR.HubConnectionBuilder()
.withUrl("/api/gamecontrol")
.withAutomaticReconnect()
.configureLogging(signalR.LogLevel.Debug)
.build();

export default class GameControlService {

  constructor() {

  }

  start(functionToExecute) {
    connection.on('UpdateGameFrame', functionToExecute);
    connection.on('UpdateTeamInfo', functionToExecute);
    connection.start();
  }
}