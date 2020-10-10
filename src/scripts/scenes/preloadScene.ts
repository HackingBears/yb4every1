import {config, gameState} from '../game';
import GameInfoService from '../services/gameInfoService';
import {Team} from '../services/team.model';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.svg('yblogo', 'assets/img/BSC_Young_Boys_logo.svg',{width:300, height:300});
    this.load.svg('fcblogo', 'assets/img/FC_Basel_logo.svg',{width:300, height:300});
    this.load.image('ybhackathon', '/assets/img/ybhackathon.png');
  }

  create() {
    new GameInfoService().getGames().then(games => {
      gameState.gameId = games[0].id;
      this.buildTeamSide(games[0].homeTeam, games[0].awayTeam);
    });
  }

  private buildTeamSide(homeTeam: Team, awayTeam: Team) {
    const width = this.game.scale.width;
    const height = this.game.scale.height;
    const posX = width / 2;
    const posY = height / 2;

    const logoYB = this.add.image(posX/2, posY, 'yblogo');
    logoYB.setInteractive()
    logoYB.on('pointerdown', ev =>
        {
          gameState.selectedTeam = homeTeam.name;
          this.scene.start('MainScene');
        }
    );

    const logoGuest = this.add.image(posX*1.5, posY, 'fcblogo');
    logoGuest.setInteractive()
    logoGuest.on('pointerdown', ev =>
        {
          gameState.selectedTeam = awayTeam.name;
          this.scene.start('MainScene');
        }
    );
    this.add.image(posX, posY*1.8, 'ybhackathon').setScale(.2,.2)
  }
}
