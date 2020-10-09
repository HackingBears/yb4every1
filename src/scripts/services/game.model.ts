import { Team } from "./team.model";

export interface Game{

    id: integer,
    kickOff: string,
    stade: string,
    awayTeam: Team,
    homeTeam: Team
}