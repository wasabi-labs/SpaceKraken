import Babylon from '../lib/Babylon';


export default class Hud {
    constructor(scene, map, match, toastr) {
        this.scene = scene;
        this.match = match;
        this.toastr = toastr;

        this.selectionEffect = Babylon.Mesh.CreatePlane('HudSelectionEffect', 1, this.scene);
        this.selectionEffect.material = new Babylon.StandardMaterial("HudSelectionEffectMaterial", this.scene);
        this.selectionEffect.material.ambientTexture = new Babylon.Texture('textures/placeholder.png', this.scene);
        this.selectionEffect.rotation.x = Math.PI / 2;
        this.selectionEffect.isVisible = false;

        this.hoverEffect = Babylon.Mesh.CreatePlane('HudHoverEffect', 1, this.scene);
        this.hoverEffect.material = new Babylon.StandardMaterial("HudHoverEffectMaterial", this.scene);
        this.hoverEffect.material.ambientTexture = new Babylon.Texture('textures/placeholder.png', this.scene);
        this.hoverEffect.rotation.x = Math.PI / 2;
        this.hoverEffect.isVisible = false;

        map.planets.forEach(planet => {
            planet.actionManager = new Babylon.ActionManager(scene);
            planet.actionManager.registerAction(new Babylon.ExecuteCodeAction(
                Babylon.ActionManager.OnPickTrigger,
                (evt) => this._mouseClick(planet)
            ))
            planet.actionManager.registerAction(new Babylon.ExecuteCodeAction(
                Babylon.ActionManager.OnPointerOverTrigger,
                (evt) => this._mouseOver(planet)
            ))
            planet.actionManager.registerAction(new Babylon.ExecuteCodeAction(
                Babylon.ActionManager.OnPointerOutTrigger,
                (evt) => this._mouseOut(planet)
            ))
        });

        this.selection = null;
    }

    _mouseClick(mesh) {
        // Ignore enemy planets
        if (! this.selection && mesh.planet.player !== this.match.currentPlayer) {
            return;
        }

        // Selection command
        if (! this.selection) {
            this.selection = mesh.planet;

            this.selectionEffect.parent = mesh;
            this.selectionEffect.scaling.x = mesh.scaling.x * 2;
            this.selectionEffect.scaling.y = mesh.scaling.y * 2;
            this.selectionEffect.isVisible = true;

            return;
        }
        // Deselection command
        if (this.selection === mesh.planet) {
            this.selection = null;
            this.selectionEffect.parent = null;
            this.selectionEffect.isVisible = false;

            return;
        }
        // Movement command
        this._move(this.selection, mesh.planet);

        this.selection = null;
        this.selectionEffect.parent = null;
        this.selectionEffect.isVisible = false;
    }

    _mouseOver(mesh) {
        // Ignore enemy planets
        if (! this.selection && mesh.planet.player !== this.match.currentPlayer) {
            return;
        }

        this.hoverEffect.parent = mesh;
        this.hoverEffect.scaling.x = mesh.scaling.x * 2;
        this.hoverEffect.scaling.y = mesh.scaling.y * 2;
        this.hoverEffect.isVisible = true;

    }

    _mouseOut(mesh) {
        this.hoverEffect.parent = null;
        this.hoverEffect.isVisible = false;
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
        // Pass
    }
}
