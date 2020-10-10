import { enable3d, Scene3D, Canvas, THREE, ExtendedObject3D } from '@enable3d/phaser-extension'

export default class Banner extends ExtendedObject3D {

    private scene :Scene3D;

    constructor(scene: Scene3D) {
        super();
        this.scene = scene;
        this.init()
    }

    init() {
        this.scene.third.load.texture('ybhackathon').then(logo => {
            logo.wrapS = logo.wrapT = 1000; // RepeatWrapping
            logo.offset.set(0, 0);
            logo.repeat.set(6, 1);

            // BUG: To add shadows to your ground, set transparent = true
            this.scene.third.physics.add.box({ name: 'banner', z: -11, y: 0.1, width: 38, depth: 2, height: 1.5, mass: 0 }, { phong: { map: logo, transparent: true } });
        })
    }

    activatePhysics(){
        this.scene.third.add.existing(this);
        this.scene.third.physics.add.existing(this);
    }

}
