class Ally {
  constructor() {
    this.container = new THREE.Object3D()
    this.model = new Model()
    this.ally = null
    this.ringExists = false

    this.model.loadModel('models/alien.js', 'mats/alien.jpg', (modeldata) => {
      this.ally = modeldata
      this.container.add(this.ally)
      this.ally.rotation.y = (3 * Math.PI) / 2

      const axes = new THREE.AxesHelper(200)
      axes.rotation.y = Math.PI

      this.ally.add(axes)
    })
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
    return this.ally.children[0]
  }
}
