function createPlayer() {
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

  class Player3D {
    constructor() {
      this.createScene()
      this.createPlane()
      this.createOrbitContols()
      this.createPlayer()
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

    createPlayer() {
      const player = new Player()
      this.scene.add(player.getPlayerCont())

      const raycaster = new THREE.Raycaster()
      const mouseVector = new THREE.Vector2()
      let clickedVect = new THREE.Vector3(0, 0, 0) // wektor określający PUNKT kliknięcia
      let directionVect = new THREE.Vector3(0, 0, 0) // wektor określający KIERUNEK ruchu playera
      const geometry = new THREE.SphereGeometry(5, 32, 32)
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      const sphere = new THREE.Mesh(geometry, material)
      this.scene.add(sphere)

      let moveAvailable = false

      $(document).on('mouseup', function () {
        moveAvailable = false
      })

      $(document).mousedown(function (event) {
        move(event)
        moveAvailable = true
      })

      $(document).on('mousemove', (event) => {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        raycaster.setFromCamera(mouseVector, this.camera)
        if (moveAvailable) {
          move(event)
        }
      })

      const move = (event) => {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        raycaster.setFromCamera(mouseVector, this.camera)

        const intersects = raycaster.intersectObjects(this.scene.children, true)

        if (intersects.length > 0) {
          clickedVect = intersects[0].point
          clickedVect.y = 20

          directionVect = clickedVect
            .clone()
            .sub(player.getPlayerCont().position)
            .normalize()

          const angle = Math.atan2(
            player.getPlayerCont().position.clone().x - clickedVect.x,
            player.getPlayerCont().position.clone().z - clickedVect.z
          )

          player.getPlayerMesh().rotation.y = angle

          sphere.position.set(clickedVect.x, clickedVect.y, clickedVect.z)
        }
        player.model.setAnimation('run')
      }

      $(document).mousedown((event) => {
        move(event)
        moveAvailable = true
      })

      const clock = new THREE.Clock()
      const render = () => {
        if (
          player.getPlayerCont().position.clone().distanceTo(clickedVect) > 5
        ) {
          player.getPlayerCont().translateOnAxis(directionVect, 5)
        } else {
          try {
            player.model.stopAnimation()
          } catch (error) {
            console.log(error)
          }
        }
        const delta = clock.getDelta()
        player.model.updateModel(delta)

        this.camera.position.x = player.getPlayerCont().position.x
        this.camera.position.z = player.getPlayerCont().position.z + 500
        this.camera.position.y = player.getPlayerCont().position.y + 500
        this.camera.lookAt(player.getPlayerCont().position)

        requestAnimationFrame(render)
        const cam = this.camera
        this.renderer.render(this.scene, cam)
      }
      render()
    }
  }

  const player = new Player3D()
}

$(document).ready(function () {
  createPlayer()
})
