import { Team } from "./teams.model";

export interface Game{

    id:integer,
    kickOff:string,
    stade:string,
    awayTeam:Team,
    homeTeam:Team
}