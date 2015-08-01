import Babylon from '../lib/Babylon';


export default class Hud {
    constructor(canvas, scene, match, toastr) {
        this.canvas = canvas;
        this.scene = scene;
        this.match = match;
        this.toastr = toastr;

        this.selection = null;
        this._click = () => {
            let ray = scene.pick(scene.pointerX, scene.pointerY);
            if (! ray.hit) {
                return;
            }

            let mesh = ray.pickedMesh;
            if (! mesh.planet) {
                return;
            }

            // Selection command
            if (! this.selection) {
                if (mesh.planet.player !== match.currentPlayer) {
                    return;
                }

                this.selection = mesh;
                return;
            }
            // Deselection command
            if (this.selection === mesh) {
                this.selection = null;
                return;
            }
            // Movement command
            let source = this.selection.planet;
            let target = mesh.planet;
            this._move(source, target);
            this.selection = null;
        };

        this.canvas.on('click', this._click);
    }

    _move(source, target) {
        this.match.move(source, target, 1);

        if (source.player === target.player) {
            this.toastr.info('Movement enqueued')
        }
        else {
            this.toastr.warning('Attack enqueued')
        }
    }

    render() {
        // Pass
    }

    dispose() {
        this.canvas.off('click', this._click);
    }
}
