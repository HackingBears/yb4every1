import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D } from '@enable3d/phaser-extension'

export default class Ball extends ExtendedObject3D {

    private scene :Scene3D

    constructor(scene: Scene3D) {
        super()
        this.scene = scene
        this.init()
    }

     init(){
        this.scene.third.load.texture('/assets/img/ball3.jpg').then(grass => {
            grass.wrapS = grass.wrapT = 1 // RepeatWrapping
            //  grass.offset.set(0, 0)
            grass.repeat.set(2, 2)
            // // BUG: To add shadows to your ground, set transparent = true
             const ball = this.scene.third.physics.add.sphere({ radius: .5 }, { phong: { map: grass, transparent: true } })
            this.add(ball)
        })
    }

    activatePhysics(){
        this.scene.third.add.existing(this)
        this.scene.third.physics.add.existing(this)
    }

}
