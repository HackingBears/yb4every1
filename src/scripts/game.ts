import * as Phaser from 'phaser'
import { enable3d, Canvas } from '@enable3d/phaser-extension'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import GameInfoService from './services/gameInfoService'
import GameControlService from './services/gameControlService'
import ChooseScene from "./scenes/chooseScene";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
    height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2)
  },
  scene: [PreloadScene, MainScene, ChooseScene],
  ...Canvas()
};

export interface GameState {
  selectedTeam: string,
  frameNumber: number,
  userId: string,
  playerId: number,
  players: Player[],
  gameId: integer,
  gameFrameUpdated: boolean
}

export interface Player {
  id: number,
  position: Position,
  hasBall: boolean
}

export interface Position {
  x: number,
  y: number
}

export let gameState = {
  selectedTeam: '',
  frameNumber: 0,
  userId: '',
  playerId: 0,
  players: [],
  gameId: 0,
  gameFrameUpdated: false
} as GameState;

window.addEventListener('load', () => {
  enable3d(() => new Phaser.Game(config)).withPhysics('/assets/ammo')
});
