import {
  FreeCamera,
  Vector3,
} from 'babylonjs';


export default class Camera {
    constructor(canvas, scene) {
        this.camera = new FreeCamera('FreeCamera', new Vector3(0, 5, -10), scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(canvas[0], false);
    }

    render() {
        // Pass
    }

    dispose() {
        // Pass
    }
}
