class Ring extends THREE.Mesh {
  constructor() {
    super(
      new THREE.RingGeometry(50, 40, 10),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide })
    )
  }
}
