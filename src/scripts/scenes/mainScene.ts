import {Scene3D, THREE,} from '@enable3d/phaser-extension'
import Ball from "../objects/ball";
import Pitch from "../objects/pitch";
import {gameState, Player as PlayerType} from '../game';
import Player from '../objects/player';
import GameControlService from '../services/gameControlService';
import Banner from '../objects/banner';


export default class MainScene extends Scene3D {

  private cam2dView : THREE.OrthographicCamera;
  private cam3dView : THREE.PerspectiveCamera;

  gameControlService: GameControlService;

  players = new Set<Player>();
  private ball : Ball;

  private textScoreAndTime: any;
  private textEvent: any;

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

    console.log(gameState);

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
    if (gameState.gameFrameUpdated) {
      this.textScoreAndTime.text = gameState.gameTime + ' - ' + gameState.gameScore;

      if (gameState.gameEvent) {
        this.textEvent.text = gameState.gameEvent;

        setTimeout(() => {
          this.textEvent.text = '';
          gameState.gameEvent = '';
        }, 2000);
      }

      if(this.players.size === 0) {
        this.initializePlayers(gameState.players);
      } else {
        let i = 0;

        this.players.forEach(player => {
          if(gameState.players[i]) {
            player.moveToPosition(gameState.players[i].position);
          }
          i++;
        })
      }

      this.ball.moveToPosition(gameState.ball, gameState.ybHasBall, gameState.otherHasBall)
      gameState.gameFrameUpdated = false;

      setTimeout(() => {this.show2d()}, 2000);
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

    const width = this.game.scale.width;
    const height = this.game.scale.height;
    const posX = width / 2;
    const posY = height / 2;

    //this.drawFieldLines();

    const ground = new Pitch(this);
    ground.activatePhysics();

    this.ball = new Ball(this);

    const banner = new Banner(this);

    this.textScoreAndTime = this.add.text(posX - 100, 5, 'TEXT', { fontSize: '5em', fontFamily: '"ComicSans MS"', color: 'black'});
    this.textEvent = this.add.text(posX - 200, posY - 60, '', { fontSize: '20em', fontFamily: '"ComicSans MS"', color: '#f2d045'});

    this.initCameras();
    this.third.camera = this.cam3dView;
    this.input.keyboard.on('keydown-O', () => {
      this.third.camera = this.cam2dView;
    });
    this.input.keyboard.on('keydown-P', () => {
      this.third.camera = this.cam3dView
    })
    this.input.keyboard.on('keydown-C', () => {
      gameState.hasBall=true;
      this.show2d();
    })
  }

  private initializePlayers(playerArray: PlayerType[]) {
    playerArray.forEach((pp, index) => {
      let color = index < 6 ? 0xf2d045 : 0x153A83;
      const player = new Player(this, pp.position, color, pp.id === gameState.playerId);
      player.activatePhysics();
      this.players.add(player);
    });
  }
}
