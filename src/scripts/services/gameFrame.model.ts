import { Player } from "../game";

export interface GameFrame{
    gameId: string,
    frameExpiration: integer,
    frameNumber: integer,
    gameEvent: String,
    gameScore: String,
    gameTime: string,
    ball: Position[],
    players: Player[],
}