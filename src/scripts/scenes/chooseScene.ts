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
    private timeBox: Rectangle;
    private chooseEndTimer : TimerEvent;
    private timeBoxTimer : TimerEvent;
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
        const buttonO = this.addButton(this.posX-(d * 1.5),this.posY, Direction.O);
        const buttonW = this.addButton(this.posX+(d * 1.5),this.posY, Direction.W);
        const buttonSO = this.addButton(this.posX-d,this.posY+d, Direction.SO);
        const buttonNO = this.addButton(this.posX-d,this.posY-d, Direction.NO);
        const buttonSW = this.addButton(this.posX+d,this.posY+d, Direction.SW);
        const buttonNW = this.addButton(this.posX+d,this.posY-d, Direction.NW);

        this.add.rectangle(this.posX, 80,this.posX+80, 50,0x000000,0.9);
        this.add.text(this.posX-200, 60,'Wähle deinen nächsten Zug',{fontSize: '4em', color: '#ffcf00', fontFamily: '"ComicSans MS"'})

    }

    update() {
        if(this.scene.isVisible('ChooseScene') && !this.visibleBefore){
            console.log("choose is visible");
            this.visibleBefore = true;
            this.timeBox = this.add.rectangle(this.posX, 107,this.posX+80, 5,0xff0000,0.5);
            this.timeBoxTimer = this.time.addEvent({delay: 100,repeat:62 ,callback: ev => {this.timeBox.width = this.timeBox.width -10}});
            this.chooseEndTimer = this.time.delayedCall(6500, ev => {this.showMainScene()}, [], this);
        }
    }

    addButton(x: number, y: number, action: Direction){
        const radius = 40;
        const alpha = 0.7;
        const color = 0xffcf00;
        const button = this.add.circle(x,y, radius, color, alpha);
        // TODO this.add.image(posX,posY+ (d * 1.5), 'grass').setRotation(45)
        button.setInteractive();
        button.on('pointerdown', ev => {
            this.chooseEndTimer.destroy();
            this.timeBoxTimer.destroy();
            this.gameControlService
                .voteNextAction({
                    action: {direction: action, action: Action.Run},
                    userID: gameState.userId,
                    gameID: gameState.gameId,
                    playerID: gameState.playerId,
                    frameNumber: gameState.frameNumber});
            this.showMainScene();
        });
    }

    showMainScene(){

        this.children.remove(this.timeBox);
        const main = this.scene.get('MainScene') as MainScene;
        main.show3d();
        this.scene.switch('MainScene');
        this.visibleBefore=false;
    }
}
