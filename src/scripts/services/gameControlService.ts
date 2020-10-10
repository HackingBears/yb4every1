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
            this.updateGameFrame(value);
        });
        connection.on('CompleteRegistration', value => {
            console.log('Registration completed!');
            gameState.playerId = value.playerId;
            gameState.userId = value.userId;
        });
        connection.on('GameFinished', () => {
            console.log('GameFinished');
        });
        connection.on('Goal', (value) => {
            gameState.gameFrameUpdated = true;
            gameState.gameEvent = value.gameEvent;
        });
        return connection.start();
    }

    sendRegistration(gameId: integer, teamType: string) {
        return connection.send('RegisterToGame', gameId, teamType);
    }

    async voteNextAction(voting: Voting) {
        await connection.send('VoteNextAction', voting);
    }

    private updateGameFrame(gameFrame: GameFrame) {
        gameState.frameNumber = gameFrame.frameNumber;
        gameState.players = gameFrame.players;
        gameState.gameFrameUpdated = true;
        gameState.gameScore = gameFrame.gameScore;
        gameState.gameTime = gameFrame.gameTime;
        gameState.gameEvent = gameFrame.gameEvent;
        gameState.ball = gameFrame.ball;
        const player = gameState.players.find(f => f.id == gameState.playerId);
        gameState.hasBall = player !== undefined && player.hasBall;

        let isYb = false;
        let isOther = false;
        const pp = gameState.players.find(p => p.hasBall);
        if (pp !== undefined) {
            if (pp.id < 6) {
                isYb = true;
            } else {
                isOther = true;
            }
        }
        gameState.ybHasBall = isYb;
        gameState.otherHasBall = isOther;
    }
}
