import {
  Color3,
  HemisphericLight,
  Mesh,
  StandardMaterial,
  Texture,
  Vector3,
} from 'babylonjs';


export default class Map {
  constructor(scene, match) {
    this.scene = scene;
    this.match = match;
    this.planets = [];

    // Light
    this.light = new HemisphericLight('AmbientLight', new Vector3(0, 1, 0), this.scene);
    this.light.intensity = 0.75;
    this.scene.clearColor = new Color3(0, 0, 0);

    // Materials
    let materials = {
      planet: new StandardMaterial('PlanetMaterial', this.scene),
      path: new StandardMaterial('PathMaterial', this.scene),
      ground: new StandardMaterial('GroundMaterial', this.scene)
    }

    let placeholder = 'textures/placeholder.png';
    materials.planet.diffuseColor = new Color3(0.2, 0.6, 1.0);
    materials.planet.ambientTexture = new Texture(placeholder, this.scene);
    materials.path.diffuseColor = new Color3(0.75, 1.0, 0.75);
    materials.path.ambientTexture = new Texture(placeholder, this.scene);
    materials.path.alpha = 0.5;
    materials.ground.wireframe = true;

    // Map
    let map = this.match.map;
    map.getPlanets().forEach(planet => {
      let position = map.getPosition(planet);

      // Planets
      let sphere = Mesh.CreateSphere(planet.name, 8, planet.size, this.scene);

      sphere.planet = planet;
      sphere.material = materials.planet;
      sphere.position.x = - (map.width / 2) + position.x;
      sphere.position.z = - (map.height / 2) + position.y;

      this.planets.push(sphere);

      // Paths
      // FIXME: Each connection is drawn twice!
      let connections = map.getConnections(planet);
      connections.forEach(connection => {
        let other = map.getPosition(connection);

        let dx = position.x - other.x;
        let dy = position.y - other.y;
        let hy = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        let path = Mesh.CreatePlane(planet.name + connection.name + 'Path', 1, this.scene);
        path.material = materials.path;
        path.parent = sphere;

        path.position.x = - dx / 2;
        path.position.z = - dy / 2;
        path.rotation.y = - Math.asin(Math.abs(dy) / hy);
        path.rotation.x = Math.PI / 2;
        path.scaling.x = hy;
        path.scaling.y = 0.1;
      })
    });

    // Debug ground
    let ground = Mesh.CreateGround('Ground', map.width, map.height, Math.max(map.width, map.height), this.scene);
    ground.material = materials.ground;
  }

  render() {
    // Pass
  }

  dispose() {
    // Pass
  }
}
