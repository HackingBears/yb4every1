import { Direction } from "./direction.model";
import { Action } from "./action.model";

export interface GameAction{
    action: Action,
    direction: Direction,
}