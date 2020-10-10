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
    this.load.svg('ybhackathon', 'assets/img/ybhackathon.svg', {width: 300, height: 90});
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
    logoYB.setInteractive({ useHandCursor: true  } )
    logoYB.on('pointerdown', ev =>
        {
          gameState.selectedTeam = homeTeam.name;
          this.scene.start('MainScene');
        }
    );

    const logoGuest = this.add.image(posX*1.5, posY, 'fcblogo');
    logoGuest.setInteractive({ useHandCursor: true  } )
    logoGuest.on('pointerdown', ev =>
        {
          gameState.selectedTeam = awayTeam.name;
          this.scene.start('MainScene');
        }
    );
    const logoYbhackathon = this.add.image(posX, posY*1.8, 'ybhackathon');
    logoYbhackathon.setInteractive({ useHandCursor: true  } )
    logoYbhackathon.setTint(0xdddddd)
    logoYbhackathon.on('pointerdown', ev =>
       {
          window.open('https://hackathon.bscyb.ch/')
       }
    );
    logoYbhackathon.on('pointerover', ev =>
    {
      logoYbhackathon.setTint(0xffffff)
    });
    logoYbhackathon.on('pointerout', ev =>
    {
      logoYbhackathon.setTint(0xdddddd)
    });
  }
}
