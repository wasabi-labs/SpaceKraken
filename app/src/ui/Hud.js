import {
  Mesh,
  Texture,
  StandardMaterial,
  ActionManager,
  ExecuteCodeAction,
} from 'babylonjs';


export default class Hud {
    constructor(scene, map, match, toastr) {
        this.scene = scene;
        this.match = match;
        this.toastr = toastr;

        this.selectionEffect = Mesh.CreatePlane('HudSelectionEffect', 1, this.scene);
        this.selectionEffect.material = new StandardMaterial('HudSelectionEffectMaterial', this.scene);
        this.selectionEffect.material.ambientTexture = new Texture('textures/placeholder.png', this.scene);
        this.selectionEffect.rotation.x = Math.PI / 2;
        this.selectionEffect.isVisible = false;

        this.hoverEffect = Mesh.CreatePlane('HudHoverEffect', 1, this.scene);
        this.hoverEffect.material = new StandardMaterial('HudHoverEffectMaterial', this.scene);
        this.hoverEffect.material.ambientTexture = new Texture('textures/placeholder.png', this.scene);
        this.hoverEffect.rotation.x = Math.PI / 2;
        this.hoverEffect.isVisible = false;

        for (let planet of map.planets) {
            planet.actionManager = new ActionManager(scene);
            planet.actionManager.registerAction(new ExecuteCodeAction(
              ActionManager.OnPickTrigger, (evt) => this._mouseClick(planet)
            ));
            planet.actionManager.registerAction(new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, (evt) => this._mouseOver(planet)
            ));
            planet.actionManager.registerAction(new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, (evt) => this._mouseOut(planet)
            ));
        }

        this.selection = null;
    }

    _mouseClick(mesh) {
        // Ignore enemy planets
        if (! this.selection && mesh.planet.player !== this.match.currentPlayer) {
            return;
        }

        // Selection command
        if (! this.selection && this.match.isSource(mesh.planet)) {
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
        if (this.match.isTarget(this.selection, mesh.planet)) {
            this._move(this.selection, mesh.planet);

            this.selection = null;
            this.selectionEffect.parent = null;
            this.selectionEffect.isVisible = false;
        }
    }

    _mouseOver(mesh) {
        if (! this.selection && ! this.match.isSource(mesh.planet)) {
            return;
        }
        if (this.selection && ! this.match.isTarget(this.selection, mesh.planet)) {
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
