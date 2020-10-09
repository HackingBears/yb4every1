import {config} from '../game';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {}

  create() {
    const width = window.innerWidth * window.devicePixelRatio as number;
    const height = window.innerHeight * window.devicePixelRatio as number;

    const button = this.add.rectangle(0, 0, (width / 2) - 20, height - 20, 0xffff00);
    button.setInteractive();
    button.on('pointerdown', ev =>
        {
          this.scene.start('MainScene');
        }
    );

    const button2 = this.add.rectangle((width / 2) + 20, 0, (width / 2) - 20, height - 20, 0x0000ff);
    button2.setInteractive();
    button2.on('pointerdown', ev =>
        {
          this.scene.start('MainScene');
        }
    );

    //this.add.text((width / 4) - 20, (height / 2) - 20, 'YB', { fontSize: '10em', color: '#000', fontFamily: '"ComicSans MS"' });
    this.add.text((config.scale?.width as number / 4) - 100, (config.scale?.height as number / 2) - 100, 'YB', { fontSize: '10em', color: '#000', fontFamily: '"ComicSans MS"' });
    this.add.text(((config.scale?.width as number / 4) * 3) - 100, (config.scale?.height as number / 2) - 100, 'FCB', { fontSize: '10em', color: '#000', fontFamily: '"ComicSans MS"' });
  }
}
