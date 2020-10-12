import {gameState} from '../game';
import {Team} from '../services/team.model';
import GameControlService from '../services/gameControlService';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.svg('yblogo', 'assets/img/BSC_Young_Boys_logo.svg',{width:300, height:300});
    this.load.svg('fcblogo', 'assets/img/FC_Basel_logo.svg',{width:300, height:300});
    this.load.svg('ybhackathon', 'assets/img/ybhackathon.svg', {width: 300, height: 90});
    this.load.image('ybforever', 'assets/img/ybforever.jpg')
  }

  create() {
    new GameControlService().getGames().then(games => {
      gameState.gameId = games[0].id;
      this.buildTeamSide(games[0].homeTeam, games[0].awayTeam);
    });
  }

  private buildTeamSide(homeTeam: Team, awayTeam: Team) {
    const width = this.game.scale.width;
    const height = this.game.scale.height;
    const posX = width / 2;
    const posY = height / 2;

    let logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'yb4every1');
    let scaleX = this.cameras.main.width / logo.width / 2;
    let scaleY = this.cameras.main.height / logo.height / 2;
    let scale = Math.max(scaleX, scaleY);
    logo.setScale(scale).setScrollFactor(0).setVisible(false);

    //  Let's show the logo when the camera shakes, and hide it when it completes

    this.cameras.main.on('camerafadeoutstart', function () {

      logo.setVisible(true);

    });

    this.cameras.main.on('camerafadeoutcomplete', function () {

      logo.setVisible(false);

    });

    this.cameras.main.fadeIn(1000);

    let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'ybforever')
    scaleX = this.cameras.main.width / image.width
    scaleY = this.cameras.main.height / image.height
    scale = Math.max(scaleX, scaleY)
    image.setScale(scale).setScrollFactor(0)

    const logoYB = this.add.image(posX/2, posY, 'yblogo');
    logoYB.setInteractive({ useHandCursor: true  } )
    logoYB.on('pointerdown', ev =>
        {
          gameState.selectedTeam = homeTeam.name;
          gameState.awayHome = 'Home';
          this.scene.start('MainScene');
        }
    );

    const logoGuest = this.add.image(posX*1.5, posY, 'fcblogo');
    logoGuest.setInteractive({ useHandCursor: true  } )
    logoGuest.on('pointerdown', ev =>
        {
          gameState.selectedTeam = awayTeam.name;
          gameState.awayHome = 'Away';
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
