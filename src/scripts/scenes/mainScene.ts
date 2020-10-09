import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D,  } from '@enable3d/phaser-extension'
import Ball from "../objects/ball";
import Pitch from "../objects/pitch";
import {gameState, Player as PlayerType, Position} from '../game';
import Player from '../objects/player';
import GameControlService from '../services/gameControlService';
import {GameFrame} from '../services/gameFrame.model';


export default class MainScene extends Scene3D {

  private cam2dView : THREE.OrthographicCamera
  private cam3dView : THREE.PerspectiveCamera

  gameControlService: GameControlService;
  isInitialGameFrame: boolean = true;

  players = new Set<Player>();

  constructor() {
    super('MainScene')
  }

  init() {
    this.accessThirdDimension()
    this.third.load.preload('grass', '/assets/img/grass.jpg')
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
      }

      gameState.gameFrameUpdated = false;
    }
  }

  updateGameStatus(gameFrame: GameFrame) {
    console.log(gameFrame);
    console.log(this.isInitialGameFrame);

    //if(this.isInitialGameFrame) {
      this.initializePlayers(gameFrame.players);
    //  this.isInitialGameFrame = false;
    //}
  }

  initCameras(){
    const zoom = 35
    const w = this.cameras.main.width / zoom
    const h = this.cameras.main.height / zoom
    this.cam2dView = this.third.cameras.orthographicCamera({ left: w / -2, right: w / 2, top: h / 2, bottom: h / -2 })
    this.cam2dView.position.set(0, 10, 0)
    this.cam2dView.lookAt(0, 0, 0)

    this.cam3dView = this.third.cameras.perspectiveCamera({  z: 30, y: 15 ,x: 0, fov:50 , near:0.1, far:1000})
    this.cam3dView.lookAt(0, 0, 0)
  }

  drawLine(startX: number, startY: number, width: number, length: number) {
    //this.third.add.box({ height: 0.1, x: startX, y: -0.5, z: startY, width: endX, depth: endY }, { lambert: { color: 0xffffff } });
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



    this.initCameras()
    this.third.camera = this.cam3dView
    this.input.keyboard.on('keydown-O', () => {
      this.third.camera = this.cam2dView;
    })
    this.input.keyboard.on('keydown-P', () => {
      this.third.camera = this.cam3dView
    })

    /*
    this.input.keyboard.on('keydown-M', () => {
      pos[0].x=5;
      players.forEach(player => {
        player.moveToPosition({x: 4, y: 4} as Position)
      })
    })

     */
  }

  private initializePlayers(playerArray: PlayerType[]) {
    //let pos : PlayerStatus[] = [{x:-1, z: 2}, {x:-1, z:0}, {x:-1, z: -2}, {x:-3, z:1}, {x:-3, z:-1}]

    playerArray.forEach((pp, index) => {
      const color = index < 6 ? 0xffff00 : 0x0000ff;
      const player = new Player(this, pp.position, color);
      player.activatePhysics();
      this.players.add(player);
    });
  }
}
