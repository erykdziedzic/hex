const {
  CylinderGeometry,
  BoxGeometry,
  Object3D,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  DoubleSide,
  TextureLoader,
} = THREE

const defaultMaterial = new MeshPhongMaterial({
  side: DoubleSide,
  map: new TextureLoader().load('../mats/stone.jpg'),
})

class Hex3D {
  constructor(dirIn, dirOut, type, material = defaultMaterial) {
    this.dirIn = parseInt(dirIn)
    this.dirOut = parseInt(dirOut)
    this.type = type
    this.radius = settings.radius
    this.container = new Object3D()
    this.container.position.y = (this.radius * 1.2124) / 4
    this.material = material

    this.createFloor()
    this.createWalls()

    if (this.type === 'light') {
      this.createLight()
    } else if (this.type === 'treasure') {
      this.createTreasure()
    }

    return this.container
  }

  createWalls() {
    const wall = this.getWallMesh()
    const door = this.getDoorMesh()

    for (let side = 0; side < 6; side++) {
      if (side === this.dirIn || side === this.dirOut) {
        this.createDoor(door, side)
      } else {
        this.createWall(wall, side)
      }
    }
  }

  createFloor() {
    const cylinder = new CylinderGeometry(
      this.radius * 1.2124,
      this.radius * 1.2124,
      1,
      6
    )
    const floor = new Mesh(cylinder, this.material)
    this.container.add(floor)
  }

  getWallMesh() {
    const geometry = new BoxGeometry(
      this.radius * 1.2124,
      (this.radius * 1.2124) / 1.5,
      this.radius / 10
    )
    return new Mesh(geometry, this.material)
  }

  getDoorMesh() {
    const geometry = new BoxGeometry(
      (this.radius * 1.2124) / 4,
      (this.radius * 1.2124) / 1.5,
      this.radius / 10
    )
    return new Mesh(geometry, this.material)
  }

  createWall(mesh, side) {
    const wall = mesh.clone()
    wall.position.x = this.radius * Math.cos((Math.PI / 3) * side)
    wall.position.z = this.radius * Math.sin((Math.PI / 3) * side)
    wall.position.y = (this.radius * 1.2124) / 4
    wall.lookAt(this.container.position)
    this.container.add(wall)
  }

  createDoor(mesh, side) {
    const doorsContainer = this.createDoorsContainer(side)

    const doorLeft = mesh
    doorLeft.position.x = this.radius / 2.2
    doorsContainer.add(doorLeft)

    const doorRight = mesh
    doorRight.position.x = -this.radius / 2.2
    doorsContainer.add(doorRight)

    this.container.add(doorsContainer)
  }

  createDoorsContainer(side) {
    const doorsContainer = new Object3D()

    doorsContainer.position.x = this.radius * Math.cos((Math.PI / 3) * side)
    doorsContainer.position.z = this.radius * Math.sin((Math.PI / 3) * side)
    doorsContainer.position.y = (this.radius * 1.2124) / 4
    doorsContainer.lookAt(this.container.position)
    return doorsContainer
  }

  createLight() {
    const light = new Light()
    light.position.set(0, 100, 0)

    const meshGeometry = new THREE.BoxGeometry(20, 20, 20)
    const meshMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(meshGeometry, meshMaterial)

    light.add(mesh)

    this.container.add(light)
    settings.lights.push(light)
  }

  createTreasure() {
    const square = new BoxGeometry(30, 30, 30)
    const treasureMaterial = new MeshBasicMaterial({ color: 0xff0000 })
    const treasure = new Mesh(square, treasureMaterial)
    this.container.add(treasure)
    treasure.position.y = 20
  }
}
