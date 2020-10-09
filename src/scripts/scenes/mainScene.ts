import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D,  } from '@enable3d/phaser-extension'
import Ball from "../objects/ball";
import Pitch from "../objects/pitch";
import Player, {PlayerStatus} from "../objects/player";
import {Position} from '../game';


export default class MainScene extends Scene3D {

  private cam2dView : THREE.OrthographicCamera
  private cam3dView : THREE.PerspectiveCamera

  constructor() {
    super('MainScene')
  }

  init() {
    this.accessThirdDimension()
    this.third.load.preload('grass', '/assets/img/grass.jpg')
  }

  create() {
    this.third.camera.updateProjectionMatrix();
    this.third.warpSpeed('-ground');

    this.drawFieldLines();

    const ground = new Pitch(this);
    ground.activatePhysics()

    const  ball = new Ball(this);
    ball.activatePhysics();

    let pos : PlayerStatus[] = [{x:-1, z: 2}, {x:-1, z:0}, {x:-1, z: -2}, {x:-3, z:1}, {x:-3, z:-1}]
    let players = new Set<Player>()
    for (const pp of pos) {
      const player = new Player(this, pp)
      player.activatePhysics()
      players.add(player)
    }


    this.initCameras()
    this.third.camera = this.cam3dView
    this.input.keyboard.on('keydown-O', () => {
      this.third.camera = this.cam2dView;
    })
    this.input.keyboard.on('keydown-P', () => {
      this.third.camera = this.cam3dView
    })

    this.input.keyboard.on('keydown-M', () => {
      pos[0].x=5;
      players.forEach(player => {
        player.moveToPosition({x: 4, y: 4} as Position)
      })
    })
  }

  update() {

  }

  updateGameStatus() {

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
}
