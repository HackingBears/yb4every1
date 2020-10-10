import MainScene from "./mainScene";
import GameControlService from "../services/gameControlService";
import {gameState} from '../game';
import {Direction} from "../services/direction.model";
import {Action} from "../services/action.model";
import Rectangle = Phaser.GameObjects.Rectangle;
import TimerEvent = Phaser.Time.TimerEvent;

export default class ChooseScene extends Phaser.Scene {
    constructor() {
        super({key: 'ChooseScene'})

    }

    private posX : number;
    private posY : number;

    private chooseEndTimer : TimerEvent;

    private text: Phaser.GameObjects.Text;
    private visibleBefore = false;
    private gameControlService: GameControlService;

    preload() {
    }

    create() {
        this.gameControlService = new GameControlService();
        const width = this.game.scale.width;
        const height = this.game.scale.height;
        this.posX = width / 2;
        this.posY = height / 2;
        const d = 100;

        const buttonS = this.addButton(this.posX,this.posY+ (d * 1.5), Direction.S);
        const buttonN = this.addButton(this.posX,this.posY-(d * 1.5), Direction.N);
        const buttonO = this.addButton(this.posX-(d * 1.5),this.posY, Direction.W);
        const buttonW = this.addButton(this.posX+(d * 1.5),this.posY, Direction.O);
        const buttonSO = this.addButton(this.posX-d,this.posY+d, Direction.SW);
        const buttonNO = this.addButton(this.posX-d,this.posY-d, Direction.NW);
        const buttonSW = this.addButton(this.posX+d,this.posY+d, Direction.SO);
        const buttonNW = this.addButton(this.posX+d,this.posY-d, Direction.NO);

        this.add.rectangle(this.posX, 40,this.posX+80, 50,0x000000,0.9);
        this.text = this.add.text(this.posX-200, 20,'Lauf in die Richtung',{fontSize: '4em', color: '#ffcf00', fontFamily: '"ComicSans MS"'})
    }

    update() {
        if(this.scene.isVisible('ChooseScene') && !this.visibleBefore){
            console.log("Vote is visible");
            this.visibleBefore = true;
            if(gameState.hasBall){
                this.text.setText('Spiele den Ball');
            }else{
                this.text.setText('Lauf in die Richtung');
            }
            this.chooseEndTimer = this.time.delayedCall(3500, ev => {this.showMainScene()}, [], this);
        }
    }

    addButton(x: number, y: number, direction: Direction){
        const radius = 40;
        const alpha = 0.7;
        const color = 0xffcf00;
        const button = this.add.circle(x,y, radius, color, alpha);

        button.setInteractive();
        button.on('pointerdown', ev => {
            this.chooseEndTimer.destroy();

            this.gameControlService
                .voteNextAction({
                    gameAction: {direction: direction, action: gameState.hasBall ? Action.Shoot : Action.Run},
                    userID: gameState.userId,
                    gameID: gameState.gameId,
                    playerID: gameState.playerId,
                    frameNumber: gameState.frameNumber + 1});
            this.showMainScene();
        });
    }

    showMainScene(){
        const main = this.scene.get('MainScene') as MainScene;
        main.show3d();
        this.scene.switch('MainScene');
        this.visibleBefore=false;
    }
}
