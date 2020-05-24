class Player {
  constructor() {
    this.container = new THREE.Object3D()
    this.model = new Model()
    this.player = null
    var that = this

    this.model.loadModel('models/devil.js', 'mats/devil.png', function (
      modeldata
    ) {
      console.log('model został załadowany', modeldata)

      that.player = modeldata

      that.container.add(that.player) // kontener w którym jest player

      that.player.rotation.y = (3 * Math.PI) / 2

      that.axes = new THREE.AxesHelper(200) // osie konieczne do kontroli kierunku ruchu
      that.axes.rotation.y = Math.PI

      that.player.add(that.axes)
    })
  }

  getPlayerCont() {
    return this.container
  }

  getPlayerMesh() {
    return this.player
  }
}
