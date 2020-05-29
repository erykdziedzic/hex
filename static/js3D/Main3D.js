function renderMap(data) {
  $(document).ready(function () {
    const scene = new THREE.Scene()

    const posRange =
      '<input id="pos" type="range" name="pos" min="50" max="150">'
    const intRange =
      '<input id="int" type="range" name="int" min="1" max="4" step="0.1">'

    $('body').append(posRange, intRange)

    $('#pos').on('input', function () {
      for (const light in settings.lights) {
        settings.lights[light].position.y = $(this).val()
      }
    })

    $('#int').on('input', function () {
      for (const light in settings.lights) {
        settings.lights[light].children[0].intensity = $(this).val()
      }
    })

    const viewWidth = $(document).width()
    const viewHeight = $(document).height()

    const camera = new THREE.PerspectiveCamera(
      45, // kąt patrzenia kamery (FOV - field of view)
      viewWidth / viewHeight, // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
      0.1, // minimalna renderowana odległość
      10000 // maxymalna renderowana odległość od kamery
    )

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(0xffffff)
    renderer.setSize(viewWidth, viewHeight)
    $('#root').append(renderer.domElement)
    $('#root').css('overflow', 'hidden')

    camera.position.set(500, 500, 500)
    camera.lookAt(scene.position)

    let geometry = new THREE.PlaneGeometry(2000, 2000, 50, 50)
    geometry.rotateX(-Math.PI * 0.5)
    let material = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      wireframe: true,
    })
    const plane = new THREE.Mesh(geometry, material)
    plane.position.set(0, 0, 0)
    scene.add(plane)

    let id = 0
    contains = false
    for (let i = 0; i < parseInt(data.size); i++) {
      for (let j = 0; j < parseInt(data.size); j++) {
        for (const el in data.level) {
          if (data.level[el].id == id.toString()) {
            if (i % 2 == 0) {
              const hex = new Hex3D(
                data.level[el].dirIn,
                data.level[el].dirOut,
                data.level[el].type
              )
              hex.position.x = j * settings.radius * 2
              hex.position.z = i * settings.radius * 1.73 * -1
              hex.rotation.y = Math.PI
              hex.position.y = 0
              scene.add(hex)
              if (data.level[el].type == 'ally') {
                const ally = new Ally()
                settings.allies.push(ally)
                scene.add(ally.getAllyCont())
                ally
                  .getAllyCont()
                  .position.set(hex.position.x, 0, hex.position.z)
              }
            } else {
              const hex = new Hex3D(
                data.level[el].dirIn,
                data.level[el].dirOut,
                data.level[el].type
              )
              hex.position.x = j * settings.radius * 2 + settings.radius
              hex.position.z = i * settings.radius * 1.73 * -1
              hex.rotation.y = Math.PI
              hex.position.y = 0
              scene.add(hex)
              if (data.level[el].type == 'ally') {
                const ally = new Ally()
                settings.allies.push(ally)
                scene.add(ally.getAllyCont())
                ally
                  .getAllyCont()
                  .position.set(hex.position.x, 0, hex.position.z)
              }
            }
          }
        }
        id++
      }
    }

    const player = new Player()
    scene.add(player.getPlayerCont())

    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()
    let clickedVect = new THREE.Vector3(0, 0, 0) // wektor określający PUNKT kliknięcia
    let directionVect = new THREE.Vector3(0, 0, 0) // wektor określający KIERUNEK ruchu playera
    let allyDirectionVect = new THREE.Vector3(0, 0, 0)

    geometry = new THREE.SphereGeometry(5, 32, 32)
    material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    let moveAvailable = false

    $(document).mousedown(function (event) {
      move(event)
      moveAvailable = true

      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        for (const ally in settings.allies) {
          if (
            settings.allies[ally].getAllyMesh() == intersects[0].object &&
            !settings.playersAllies.includes(settings.allies[ally])
          ) {
            settings.playersAllies.push(settings.allies[ally])
          }
        }
      }
    })

    $(document).on('mousemove', function (event) {
      mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
      mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
      raycaster.setFromCamera(mouseVector, camera)

      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        for (const ally in settings.allies) {
          if (settings.allies[ally].getAllyMesh() == intersects[0].object) {
            settings.allies[ally].setRing()
          } else {
            settings.allies[ally].removeRing()
          }
        }
      }
      if (moveAvailable) {
        move(event)
      }
    })

    $(document).on('mouseup', function () {
      moveAvailable = false
    })

    let playerIsMoving = false

    function move(event) {
      mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
      mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
      raycaster.setFromCamera(mouseVector, camera)

      const intersects = raycaster.intersectObjects(scene.children, true)

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
      playerIsMoving = true

      for (ally in settings.playersAllies) {
        settings.playersAllies[ally].model.setAnimation('run')
      }
    }

    const clock = new THREE.Clock()

    function render() {
      if (player.getPlayerCont().position.clone().distanceTo(clickedVect) > 5) {
        player.getPlayerCont().translateOnAxis(directionVect, 5)
      } else {
        try {
          player.model.stopAnimation()
          playerIsMoving = false
        } catch (error) {
          console.log(error)
        }
      }

      for (ally in settings.playersAllies) {
        if (ally != 0) {
          if (
            settings.playersAllies[ally]
              .getAllyCont()
              .position.clone()
              .distanceTo(
                settings.playersAllies[ally - 1].getAllyCont().position
              ) > 100
          ) {
            const allyAngle = Math.atan2(
              settings.playersAllies[ally].getAllyCont().position.clone().x -
                settings.playersAllies[ally - 1].getAllyCont().position.clone()
                  .x,
              settings.playersAllies[ally].getAllyCont().position.clone().z -
                settings.playersAllies[ally - 1].getAllyCont().position.clone()
                  .z
            )
            allyDirectionVect = settings.playersAllies[ally - 1]
              .getAllyCont()
              .position.clone()
              .sub(settings.playersAllies[ally].getAllyCont().position)
              .normalize()
            settings.playersAllies[ally].getAllyModel().rotation.y = allyAngle

            settings.playersAllies[ally].getAllyCont().position.y = 20

            settings.playersAllies[ally]
              .getAllyCont()
              .translateOnAxis(allyDirectionVect, 5)
          } else {
            settings.playersAllies[ally].model.stopAnimation()
            settings.playersAllies[ally].model.setAnimation('stand')
          }

          if (playerIsMoving) {
            settings.playersAllies[ally].model.setAnimation('run')
          } else {
            settings.playersAllies[ally].model.stopAnimation()
            settings.playersAllies[ally].model.setAnimation('salute')
          }
        } else {
          if (
            settings.playersAllies[ally]
              .getAllyCont()
              .position.clone()
              .distanceTo(player.getPlayerCont().position) > 100
          ) {
            const allyAngle = Math.atan2(
              settings.playersAllies[ally].getAllyCont().position.clone().x -
                player.getPlayerCont().position.clone().x,
              settings.playersAllies[ally].getAllyCont().position.clone().z -
                player.getPlayerCont().position.clone().z
            )

            allyDirectionVect = player
              .getPlayerCont()
              .position.clone()
              .sub(settings.playersAllies[ally].getAllyCont().position)
              .normalize()
            settings.playersAllies[ally].getAllyModel().rotation.y = allyAngle

            settings.playersAllies[ally].getAllyCont().position.y = 20

            settings.playersAllies[ally]
              .getAllyCont()
              .translateOnAxis(allyDirectionVect, 5)
          } else {
            settings.playersAllies[ally].model.stopAnimation()
            settings.playersAllies[ally].model.setAnimation('salute')
          }

          if (playerIsMoving) {
            settings.playersAllies[ally].model.setAnimation('run')
          } else {
            settings.playersAllies[ally].model.stopAnimation()
            settings.playersAllies[ally].model.setAnimation('salute')
          }
        }
      }

      const delta = clock.getDelta()
      player.model.updateModel(delta)

      for (ally in settings.playersAllies) {
        settings.playersAllies[ally].model.updateModel(delta)
      }

      camera.position.x = player.getPlayerCont().position.x
      camera.position.z = player.getPlayerCont().position.z + 500
      camera.position.y = player.getPlayerCont().position.y + 500
      camera.lookAt(player.getPlayerCont().position)

      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    render()
  })
}
