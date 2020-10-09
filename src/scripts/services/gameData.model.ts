import { Team } from "./teams.model";

export interface GameData{

    gameId:string,
    color:string,
    frameExpiration: number
	currentPlaytime: string,
	gameScore: String,
    gameEvent: String,
    teams:Team[]
    
}