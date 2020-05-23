function createSingleHex() {
  const {
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    Scene,
    PerspectiveCamera,
    PlaneGeometry,
    WebGLRenderer,
    OrbitControls,
  } = THREE

  class SingleHex {
    constructor() {
      this.createScene()
      this.createPlane()
      this.createOrbitContols()
      this.createHex()
      this.render()
    }

    createScene() {
      this.scene = new Scene()
      this.camera = new PerspectiveCamera(
        45,
        $(document).width() / $(document).height(),
        0.1,
        10000
      )
      this.camera.position.set(500, 500, 500)
      this.camera.lookAt(this.scene.position)

      this.renderer = new WebGLRenderer({ antialias: true })
      this.renderer.setClearColor(0xffffff)
      this.renderer.setSize($(document).width(), $(document).height())
      $('#root').append(this.renderer.domElement)
    }

    createPlane() {
      const geometry = new PlaneGeometry(2000, 2000, 50, 50)
      geometry.rotateX(-Math.PI * 0.5)
      const material = new MeshBasicMaterial({
        color: 0xaaaaaa,
        wireframe: true,
      })
      const plane = new Mesh(geometry, material)
      plane.position.set(0, 0, 0)
      this.scene.add(plane)
    }

    createOrbitContols() {
      const orbitControl = new OrbitControls(
        this.camera,
        this.renderer.domElement
      )
      orbitControl.addEventListener('change', () =>
        this.renderer.render(this.scene, this.camera)
      )
    }

    createHex() {
      const material = new MeshNormalMaterial()
      this.hex = new Hex3D(2, 5, 'walls', material)
      this.hex.rotation.y = Math.PI
      this.hex.position.y = 0
      this.scene.add(this.hex)
    }

    render() {
      requestAnimationFrame(() => this.render())
      this.renderer.render(this.scene, this.camera)
    }
  }

  const hex = new SingleHex()
}

$(document).ready(function () {
  createSingleHex()
})
