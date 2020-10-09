import * as signalR from "@microsoft/signalr"
import { Voting } from "./voting.model";

const connection = new signalR.HubConnectionBuilder()
.withUrl("/app/gamehub")
.withAutomaticReconnect()
.configureLogging(signalR.LogLevel.Debug)
.build();

export default class GameControlService {

  constructor() {

  }

  start() {
    connection.on('UpdateGameFrame', () => {
        console.log('GameFrame received!');
    });
    connection.on('CompleteRegistration', () => {
        console.log('Registration completed!');
    });
    return connection.start();
  }

  async sendRegistration(gameId: integer, teamType: string)
  {
    await connection.send('RegisterToGame', gameId, teamType);
  }

  async voteNextAction(voting: Voting)
  {
    await connection.send('VoteNextAction', voting);
  }
}