class Ally {
  constructor() {
    this.container = new THREE.Object3D()
    this.model = new Model()
    this.ally = null
    this.ringExists = false

    this.model.loadModel(
      'models/skeleton.js',
      'mats/skeleton.png',
      (modeldata) => {
        this.ally = modeldata
        this.container.add(this.ally)
        this.ally.rotation.y = (3 * Math.PI) / 2

        const light = new Light()
        light.position.set(0, 100, 0)
        this.container.add(light)
        settings.lights.push(light)

        const axes = new THREE.AxesHelper(200)
        axes.rotation.y = Math.PI

        this.ally.add(axes)
      }
    )
  }

  setRing() {
    if (this.ringExists === false) {
      const ring = new Ring()
      ring.rotation.x = Math.PI / 2
      ring.position.y += 10
      this.container.add(ring)
      this.ringExists = true
    }
  }

  removeRing() {
    this.container.children.forEach((child) => {
      if (child.type === 'Mesh') {
        this.container.remove(child)
        this.ringExists = false
      }
    })
  }

  getAllyCont() {
    return this.container
  }

  getAllyModel() {
    return this.ally
  }

  getAllyMesh() {
    if (this.ally) {
      return this.ally.children[0]
    }
  }
}
