import {config, gameState} from '../game';
import GameInfoService from '../services/gameInfoService';
import {Team} from '../services/teams.model';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('yblogo', 'assets/img/BSC_Young_Boys_logo.svg')
    this.load.image('fcblogo', 'assets/img/FC_Basel_logo.svg')
  }

  create() {
    new GameInfoService().getGames().then(games => {
      gameState.gameId = games[0].id;
      this.buildTeamSide(games[0].homeTeam, games[0].awayTeam);
    });
  }

  private buildTeamSide(homeTeam: Team, awayTeam: Team) {
    const width = window.outerWidth as number;
    const height = window.outerHeight as number;

    const button = this.add.rectangle(0, 0, width, height * 2);
    button.setInteractive();
    button.on('pointerdown', ev =>
        {
          gameState.selectedTeam = homeTeam.name;
          this.scene.start('MainScene');
        }
    );

    const button2 = this.add.rectangle(width, 0, width, height * 2);
    button2.setInteractive();
    button2.on('pointerdown', ev =>
        {
          gameState.selectedTeam = awayTeam.name;
          this.scene.start('MainScene');
        }
    );

    let image1 = this.add.image(
        this.textures.get('yblogo').getSourceImage().width / 2,
        this.textures.get('yblogo').getSourceImage().height / 2,
        'yblogo');
    image1.setScale( image1.width / width * 2);
    let image2 = this.add.image(
        width - this.textures.get('fcblogo').getSourceImage().width / 2,
        this.textures.get('fcblogo').getSourceImage().height / 2,
        'fcblogo');
    image2.setScale( image1.width / width * 2);
  }
}
