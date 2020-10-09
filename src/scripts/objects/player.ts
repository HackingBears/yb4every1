import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D } from '@enable3d/phaser-extension'

export default class Player extends ExtendedObject3D {

    private scene :Scene3D
    private ps : PlayerStatus

    constructor(scene: Scene3D, status : PlayerStatus) {
        super()
        this.scene = scene
        this.ps = status
        const body = scene.third.add.box({ height: 1.5, y: 0, width: 0.8, depth: 0.8 }, { lambert: { color: 0xffff00 } })
        const head = scene.third.add.sphere({ radius: 0.5, y: 1.3, z: 0.05 }, { lambert: { color: 0xffff00 } })
        this.add(body, head)
    }

    activatePhysics(){
        this.position.set(this.ps.x, this.ps.y || 5, this.ps.z)
        this.scene.third.add.existing(this)
        this.scene.third.physics.add.existing(this)
    }

    update(){
        // tween the position
        this.body.setCollisionFlags(2)
        let tmp = this.position.clone()
        this.scene.tweens.add({
            targets: tmp,
            duration: 5000,
            delay: 100,
            x: this.ps.x,
            z: this.ps.z,
            onUpdate: () => {
                this.position.set(tmp.x, tmp.y, tmp.z)
                this.body.needUpdate = true
            }
        })
    }
}

export class PlayerStatus {
    x: number
    y?: number
    z: number
}
