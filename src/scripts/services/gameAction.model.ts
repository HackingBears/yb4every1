export interface GameAction{
    action: Action,
    direction: Direction,
}

export enum Direction{
    N = 'N',
    NO = 'NO',
    O = 'O',
    SO = 'SO',
    S = 'S',
    SW = 'SW',
    W = 'W',
    NW = 'NW',
}

export enum Action{
    Run = 'Run',
    Shoot = 'Shoot'
}
