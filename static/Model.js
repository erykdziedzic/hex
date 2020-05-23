class Model {
  constructor() {
    this.container = new THREE.Object3D()
    this.mixer = null
  }

  loadModel(modelUrl, matUrl, callback) {
    var modelMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(matUrl),
      morphTargets: true, // ta własność odpowiada za animację materiału modelu
    })

    var loader = new THREE.JSONLoader()

    loader.load(
      modelUrl,
      function (geometry) {
        var meshModel = new THREE.Mesh(geometry, modelMaterial)
        meshModel.name = 'name'
        meshModel.rotation.y = (3 * Math.PI) / 2
        meshModel.position.y = 50
        meshModel.scale.set(2, 2, 2)

        this.mixer = new THREE.AnimationMixer(meshModel)

        this.container.add(meshModel)

        console.log(geometry.animations)

        callback(this.container)
      }.bind(this)
    )
  }

  updateModel(delta) {
    if (this.mixer) this.mixer.update(delta)
  }

  setAnimation(animation) {
    this.mixer.clipAction(animation).play()
  }

  stopAnimation() {
    this.mixer.stopAllAction()
  }
}
