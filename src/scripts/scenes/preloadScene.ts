import {config, gameState} from '../game';
import GameInfoService from '../services/gameInfoService';
import {Team} from '../services/teams.model';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {}

  create() {
    //GameInfoService --> Get Teams
    new GameInfoService().getGames().then(games => {
      this.buildTeamSide(games[0].homeTeam, games[0].awayTeam);
    });
  }

  private buildTeamSide(homeTeam: Team, awayTeam: Team) {
    const width = window.innerWidth * window.devicePixelRatio as number;
    const height = window.innerHeight * window.devicePixelRatio as number;

    const button = this.add.rectangle(0, 0, (width / 2) - 20, height - 20, 0xffff00);
    button.setInteractive();
    button.on('pointerdown', ev =>
        {
          gameState.selectedTeam = homeTeam.name;
          //GameStartService -> Start Game with Team Name
          this.scene.start('MainScene');
        }
    );

    const button2 = this.add.rectangle((width / 2) + 20, 0, (width / 2) - 20, height - 20, 0x0000ff);
    button2.setInteractive();
    button2.on('pointerdown', ev =>
        {
          gameState.selectedTeam = awayTeam.name;
          //GameStartService -> Start Game with Team Name
          this.scene.start('MainScene');
        }
    );

    this.add.text((config.scale?.width as number / 4) - 100, (config.scale?.height as number / 2) - 50, homeTeam.name, { fontSize: '6em', color: '#000', fontFamily: '"ComicSans MS"' });
    this.add.text(((config.scale?.width as number / 4) * 3) - 100, (config.scale?.height as number / 2) - 50, awayTeam.name, { fontSize: '6em', color: '#000', fontFamily: '"ComicSans MS"' });
  }
}
