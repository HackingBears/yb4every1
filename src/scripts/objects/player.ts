import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D } from '@enable3d/phaser-extension'
import {Position} from '../game';

export default class Player extends ExtendedObject3D {

    private scene :Scene3D;
    private ps : Position;

    private factor: number = 3.0;

    constructor(scene: Scene3D, position : Position, color: number) {
        super();
        this.scene = scene;
        this.ps = position;
        const body = scene.third.add.box({ height: 1.5, y: 0, width: 0.8, depth: 0.8 }, { lambert: { color } });
        const head = scene.third.add.sphere({ radius: 0.5, y: 1.3, z: 0.05 }, { lambert: { color } });
        this.add(body, head)
    }

    activatePhysics(){
        this.position.set(this.ps.x * this.factor, 0.2, this.ps.y * this.factor);
        this.scene.third.add.existing(this)
        this.scene.third.physics.add.existing(this)
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
