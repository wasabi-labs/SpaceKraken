import Babylon from '../lib/Babylon';


export default class Camera {
    constructor(canvas, scene) {
        this.camera = new Babylon.FreeCamera('FreeCamera', new Babylon.Vector3(0, 5, -10), scene);
        this.camera.setTarget(Babylon.Vector3.Zero());
        this.camera.attachControl(canvas[0], false);
    }

    render() {
        // Pass
    }

    dispose() {
        // Pass
    }
}
