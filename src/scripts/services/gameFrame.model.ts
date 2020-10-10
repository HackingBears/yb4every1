import { Player, Position } from "../game";

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
