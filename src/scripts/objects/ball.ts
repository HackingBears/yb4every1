import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D } from '@enable3d/phaser-extension'
import {Position} from "../game";

export default class Ball extends ExtendedObject3D {

    private scene :Scene3D;
    private factor: number = 3.0;

    constructor(scene: Scene3D) {
        super();
        this.scene = scene;
        this.init();
    }

     init(){
        this.scene.third.load.texture('/assets/img/ball3.jpg').then(grass => {
            grass.wrapS = grass.wrapT = 1; // RepeatWrapping
            //  grass.offset.set(0, 0)
            grass.repeat.set(2, 2);
            // // BUG: To add shadows to your ground, set transparent = true
            const ball = this.scene.third.add.sphere({ y: 0,  radius: .5 }, { phong: { map: grass, transparent: false } });
            this.add(ball);
        });

        this.scene.third.add.existing(this);
    }
    moveToPosition(newPosition: Position){
        // tween the position
        this.body.setCollisionFlags(2)
        let tmp = this.position.clone()
        this.scene.tweens.add({
            targets: tmp,
            duration: 700,
            delay: 100,
            x: newPosition.x * this.factor,
            z: newPosition.y * this.factor,
            onUpdate: () => {
                this.position.set(tmp.x, tmp.y, tmp.z);
                this.body.needUpdate = true
            }
        })
    }
}
