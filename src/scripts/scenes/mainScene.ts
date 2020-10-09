import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D,  } from '@enable3d/phaser-extension'

export default class MainScene extends Scene3D {

  constructor() {
    super('MainScene')
  }

  init() {
    this.accessThirdDimension()
  }

  create() {
    this.third.camera.updateProjectionMatrix()
    this.third.warpSpeed('-ground')

    const platformMaterial = { phong: { transparent: true, color: 0x21572f } }
    this.third.physics.add.box({ name: 'platform-ground', y: -1, width: 15, depth: 25, height: 1, mass: 0 }, platformMaterial)
  }

  update() {}
}
