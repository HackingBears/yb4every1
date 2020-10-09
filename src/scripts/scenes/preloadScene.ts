export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {}

  create() {
    const button = this.add.circle(100,100,50, 0xff0000)
    button.setInteractive();
    button.on('pointerover', ev =>
        {
          this.scene.start('MainScene')
        }
    )
  }
}
