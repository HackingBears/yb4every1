import * as Phaser from 'phaser'
import { enable3d, Canvas } from '@enable3d/phaser-extension'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import GameInfoService from './services/gameInfoService'
import GameControlService from './services/gameControlService'

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
    height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2)
  },
  scene: [PreloadScene, MainScene],
  ...Canvas()
};

export interface GameState {
  selectedTeam: string,
  frameNumber: number,
  userId: string,
  playerId: string,
  players: Player[]
}

export interface Player {
  playerId: string,
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
  playerId: '',
  players: []
} as GameState;

window.addEventListener('load', () => {
  enable3d(() => new Phaser.Game(config)).withPhysics('/assets/ammo')
});
