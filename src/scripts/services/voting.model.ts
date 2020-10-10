import { GameAction } from "./gameAction.model";

export interface Voting{
    userID: string,
	gameID: integer,
	playerID: integer,
	gameAction: GameAction,
	frameNumber: integer,
}
