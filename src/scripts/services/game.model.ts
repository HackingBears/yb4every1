export interface Game{
    id: integer,
    kickOff: string,
    stade: string,
    awayTeam: Team,
    homeTeam: Team
}

export interface Team{
    id: integer,
    logo: string,
    name: string,
    firstColor: string,
    secondColor: string,
}
