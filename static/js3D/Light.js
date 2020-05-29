class Light {
  constructor(scene, color) {
    this.scene = scene
    this.color = color
    this.container = new THREE.Object3D()

    this.createLight()
    return this.container
  }

  createLight() {
    this.light = new THREE.PointLight(this.color, 2, 300, Math.PI / 8)
    this.light.intensity = 2.5
    this.light.position.y = 100

    this.container.add(this.light)
  }

  getLight() {
    return this.container
  }

  changeColor(color) {
    console.log('zmiana koloru na ' + color)
  }
}
