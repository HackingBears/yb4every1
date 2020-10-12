import * as signalR from "@microsoft/signalr"
import {HttpTransportType} from "@microsoft/signalr"
import {Voting} from "./voting.model";
import {gameState, Player, Position} from '../game';
import {Game} from './game.model';
import axios from 'axios';

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/app/gamehub", HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

export default class GameControlService {

    constructor() {

    }

    async getGames():Promise<Game[]>{
        return await (await axios.get('/app/games')).data;
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
            gameState.gameFrameUpdated = true;
            gameState.gameEvent = 'Game finished...';
            setTimeout(() => {
                window.location.reload();
            }, 10000)
        });
        connection.on('GameEventHappened', (value) => {
            gameState.gameFrameUpdated = true;
            gameState.gameEvent = value.message;
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
        gameState.frameExpiration = gameFrame.frameExpiration;
        gameState.showVoting = gameState.frameExpiration > 0;           // Voting should only be displayed if it is a regular GameFrame and not an event notification
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

export interface GameFrame{
    gameId: string,
    frameExpiration: integer,
    frameNumber: integer,
    gameEvent: string,
    gameScore: string,
    gameTime: string,
    ball: Position,
    players: Player[],
}
