import * as signalR from "@microsoft/signalr"
import {HttpTransportType} from "@microsoft/signalr"
import {Voting} from "./voting.model";
import {gameState} from '../game';
import {GameFrame} from './gameFrame.model';

const connection = new signalR.HubConnectionBuilder()
.withUrl("/app/gamehub", HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling)
.withAutomaticReconnect()
.configureLogging(signalR.LogLevel.Debug)
.build();

export default class GameControlService {

  constructor() {

  }

  start() {
    connection.on('UpdateGameFrame', value => {
        console.log('GameFrame received!');
        console.log(value);
        this.updateGameFrame(value);
    });
    connection.on('CompleteRegistration', value => {
        console.log('Registration completed!');
        gameState.playerId = value.playerId;
        gameState.userId = value.userId;
    });
    return connection.start();
  }

  sendRegistration(gameId: integer, teamType: string)
  {
    return connection.send('RegisterToGame', gameId, teamType);
  }

  async voteNextAction(voting: Voting)
  {
    await connection.send('VoteNextAction', voting);
  }

  private updateGameFrame(gameFrame: GameFrame) {
    gameState.frameNumber = gameFrame.frameNumber;
    gameState.players = gameFrame.players;
    gameState.gameFrameUpdated = true;
  }
}
