import {Scene3D, THREE,} from '@enable3d/phaser-extension'
import Ball from "../objects/ball";
import Pitch from "../objects/pitch";
import {gameState, Player, Position} from '../game';
import PlayerObject from '../objects/player';
import GameControlService from '../services/gameControlService';
import Banner from '../objects/banner';


export default class MainScene extends Scene3D {

  private cam2dView : THREE.OrthographicCamera;
  private cam3dView : THREE.PerspectiveCamera;

  gameControlService: GameControlService;

  players = new Set<PlayerObject>();
  private ball : Ball;

  private textScoreAndTime: any;

  private positionExtensionFactor: number = 3.0;

  constructor() {
    super('MainScene')
  }

  init() {
    this.accessThirdDimension();
    this.third.load.preload('grass', '/assets/img/grass2.jpg');
    this.third.load.preload('soccerfield', '/assets/img/soccer_field.jpg');
    this.third.load.preload('ybhackathon', '/assets/img/ybhackathon.png');
  }

  create() {
    this.gameControlService = new GameControlService();

    this.gameControlService.start().then(() => {
      this.gameControlService.sendRegistration(1, gameState.awayHome).then(() => {
        this.buildScene();
      });
    });

    this.input.keyboard.on('keydown-M', () => {
      this.show2d();
    })
  }

  update() {
    if (gameState.gameFrameUpdated && this.textScoreAndTime) {
      this.updateScoreBoard();
      this.updatePlayers();
      this.updateBall();
      this.updateVoting();

      gameState.gameFrameUpdated = false;
    }
  }

  private updateScoreBoard() {
    if (gameState.gameEvent) {
      this.textScoreAndTime.text = gameState.gameEvent;
    } else {
      this.textScoreAndTime.text = gameState.gameTime + ' - ' + gameState.gameScore;
    }
  }

  private updatePlayers() {
    if(this.players.size === 0) {
      this.initializePlayers(gameState.players);
    } else {
      let i = 0;

      let playerPositions: Position[] = [];

      this.players.forEach(player => {
        if(gameState.players[i]) {
          let currentPlayersPositionOnField = this.getNearestFreePlayerPosition(playerPositions,
              this.extendPosition(gameState.players[i].position));

          playerPositions.push(currentPlayersPositionOnField);
          player.moveToPosition(currentPlayersPositionOnField);
        }
        i++;
      })
    }
  }

  private updateBall() {
    this.ball.moveToPosition(gameState.ball, gameState.ybHasBall, gameState.otherHasBall);
  }

  private updateVoting() {
    if (gameState.showVoting) {
      setTimeout(() => {this.show2d()}, 2000);
      gameState.showVoting = false;
    }
  }

  initCameras(){
    const zoom = 29;
    const w = this.cameras.main.width / zoom;
    const h = this.cameras.main.height / zoom;
    this.cam2dView = this.third.cameras.orthographicCamera({ left: w / -2, right: w / 2, top: h / 2, bottom: h / -2 });
    this.cam2dView.position.set(0, 10, 0);
    this.cam2dView.lookAt(0, 0, 0);

    this.cam3dView = this.third.cameras.perspectiveCamera({  z: 20, y: 10 ,x: 0, fov:50 , near:0.1, far:1000});
    this.cam3dView.lookAt(0, 0, 0);
  }

  show3d(){
    this.third.camera = this.cam3dView;
  }

  show2d(){
    this.third.camera = this.cam2dView;
    this.time.delayedCall(1500, ev => {this.showChooseScene()}, [], this);
  }

  showChooseScene(){
    this.scene.switch('ChooseScene')
  }

  private buildScene() {
    this.third.camera.updateProjectionMatrix();
    this.third.warpSpeed('-ground');

    const width = this.game.scale.width;
    const height = this.game.scale.height;
    const posX = width / 2;
    const posY = height / 2;

    const ground = new Pitch(this);
    ground.activatePhysics();

    this.ball = new Ball(this);

    const banner = new Banner(this);

    this.add.rectangle(posX, 40,posX+80, 50,0x000000,0.9);
    this.textScoreAndTime = this.add.text(posX - 120, 20, 'Es läuft zur Zeit leider kein Spiel 8)', { fontSize: '4em', fontFamily: '"Arial"', color: '#ffcf00'});

    this.initCameras();
    this.third.camera = this.cam3dView;
    this.input.keyboard.on('keydown-O', () => {
      this.third.camera = this.cam2dView;
    });
    this.input.keyboard.on('keydown-P', () => {
      this.third.camera = this.cam3dView
    });
    this.input.keyboard.on('keydown-C', () => {
      gameState.hasBall=true;
      this.show2d();
    });
  }

  private initializePlayers(playerArray: Player[]) {
    playerArray.forEach((pp, index) => {
      let color = index < 6 ? 0xf2d045 : 0x153A83;
      const player = new PlayerObject(this, pp.position, color, pp.id === gameState.playerId);
      player.activatePhysics();
      this.players.add(player);
    });
  }

  private isPositionFree(playerPositions: Position[], position: Position): boolean {
    for (const playerPosition of playerPositions) {
      if (this.positionEquals(playerPosition, position)) {
        return false;
      }
    }
    return true;
  }

  private extendPosition(position: Position): Position {
    return { x: position.x * this.positionExtensionFactor, y: position.y *  this.positionExtensionFactor} as Position
  }

  private getNearestFreePlayerPosition(playerPositions: Position[], position: Position) {
    if (this.isPositionFree(playerPositions, position)){
      return position;
    }

    const pathCheckingPositions = [
      {x: 0, y: 1},
      {x: 1, y: 0},
      {x: 0, y: -1},
      {x: 0, y: -1},
      {x: -1, y: 0},
      {x: -1, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 1},
    ] as Position[];

    for (const nextPath of pathCheckingPositions) {
      const newPosition = this.addPositions(position, nextPath);
      if (this.isPositionFree(playerPositions, newPosition)){
        return newPosition;
      }
    }

    return position;
  }

  private positionEquals(position1: Position, position2: Position): boolean {
    return (position1.x === position2.x) && (position1.y === position2.y);
  }

  private addPositions(position1: Position, position2: Position): Position {
    return {x: position1.x + position2.x, y: position1.y + position2.y} as Position
  }
}
