import {Scene3D, THREE,} from '@enable3d/phaser-extension'
import Ball from "../objects/ball";
import Pitch from "../objects/pitch";
import {gameState, Player as PlayerType} from '../game';
import Player from '../objects/player';
import GameControlService from '../services/gameControlService';


export default class MainScene extends Scene3D {

  private cam2dView : THREE.OrthographicCamera;
  private cam3dView : THREE.PerspectiveCamera;

  gameControlService: GameControlService;

  players = new Set<Player>();

  constructor() {
    super('MainScene')
  }

  init() {
    this.accessThirdDimension();
    this.third.load.preload('grass', '/assets/img/grass.jpg');
  }

  create() {
    this.gameControlService = new GameControlService();

    this.gameControlService.start().then(() => {
      this.gameControlService.sendRegistration(1, 'Home').then(() => {
        this.buildScene();
      });
    });
  }

  update() {
    if (gameState.gameFrameUpdated) {
      if(this.players.size === 0) {
        this.initializePlayers(gameState.players);
      } else {
        let i = 0;

        this.players.forEach(player => {
          if(gameState.players[i]) {
            player.moveToPosition(gameState.players[i].position);
            console.log(gameState.players[i].position);
          }
          i++;
        })
      }

      gameState.gameFrameUpdated = false;
    }
  }

  initCameras(){
    const zoom = 35;
    const w = this.cameras.main.width / zoom;
    const h = this.cameras.main.height / zoom;
    this.cam2dView = this.third.cameras.orthographicCamera({ left: w / -2, right: w / 2, top: h / 2, bottom: h / -2 });
    this.cam2dView.position.set(0, 10, 0);
    this.cam2dView.lookAt(0, 0, 0);

    this.cam3dView = this.third.cameras.perspectiveCamera({  z: 30, y: 15 ,x: 0, fov:50 , near:0.1, far:1000});
    this.cam3dView.lookAt(0, 0, 0);
  }

  drawLine(startX: number, startY: number, width: number, length: number) {
    this.third.add.box({ x: startX, y: -0.5, z: startY, width: width, height: 0.1, depth: length }, { lambert: { color: 0xffffff } });
  }

  private drawFieldLines() {
    //Border Lines
    this.drawLine(0, 8.9, 36, 0.3);
    this.drawLine(0, -8.9, 36, 0.3);
    this.drawLine(17.9, 0, 0.3, 18);
    this.drawLine(-17.9, 0, 0.3, 18);

    //Middle Line
    this.drawLine(0, 0, 0.3, 18);

  }

  private buildScene() {
    this.third.camera.updateProjectionMatrix();
    this.third.warpSpeed('-ground');

    this.drawFieldLines();

    const ground = new Pitch(this);
    ground.activatePhysics();

    const ball = new Ball(this);

    this.initCameras();
    this.third.camera = this.cam3dView;
    this.input.keyboard.on('keydown-O', () => {
      this.third.camera = this.cam2dView;
    });
    this.input.keyboard.on('keydown-P', () => {
      this.third.camera = this.cam3dView
    })
  }

  private initializePlayers(playerArray: PlayerType[]) {
    playerArray.forEach((pp, index) => {
      const color = index < 6 ? 0xffff00 : 0x0000ff;
      const player = new Player(this, pp.position, color);
      player.activatePhysics();
      this.players.add(player);
    });
  }
}
