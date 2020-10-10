import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D } from '@enable3d/phaser-extension'

export default class Pitch extends ExtendedObject3D {

    private scene :Scene3D

    constructor(scene: Scene3D) {
        super()
        this.scene = scene
        this.init()
    }

    init(){
        this.scene.third.load.texture('soccerfield').then(grass => {
            grass.wrapS = grass.wrapT = 1000; // RepeatWrapping
            grass.offset.set(0, 0);
            grass.repeat.set(1, 1);

            // BUG: To add shadows to your ground, set transparent = true
            this.scene.third.physics.add.box({ name: 'platform-ground', y: -1, width: 38, depth: 20, height: 1, mass: 0 }, { phong: { map: grass, transparent: true } })
        })
    }

    activatePhysics(){
        this.scene.third.add.existing(this)
        this.scene.third.physics.add.existing(this)
    }

}
