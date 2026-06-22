(function () {
  const canvas = document.getElementById("three-hero");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const geometry = new THREE.IcosahedronGeometry(1.35, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x14B8A6,
    metalness: 0.35,
    roughness: 0.25,
    wireframe: false
  });
  const shape = new THREE.Mesh(geometry, material);
  shape.position.x = -2.75;
  shape.position.y = 0.35;
  scene.add(shape);

  const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.85, 0.018, 110, 12),
    new THREE.MeshBasicMaterial({ color: 0xD4AF37 })
  );
  wire.position.x = -2.75;
  wire.position.y = 0.35;
  scene.add(wire);

  const pointsGeometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 160; i++) {
    positions.push(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    );
  }
  pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const points = new THREE.Points(
    pointsGeometry,
    new THREE.PointsMaterial({ color: 0xD4AF37, size: 0.025, transparent: true, opacity: 0.75 })
  );
  scene.add(points);

  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const light = new THREE.PointLight(0x14B8A6, 8, 20);
  light.position.set(2, 3, 4);
  scene.add(light);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.35;
  }, { passive: true });

  function animate() {
    shape.rotation.x += 0.004;
    shape.rotation.y += 0.007;
    wire.rotation.x -= 0.003;
    wire.rotation.y += 0.006;
    points.rotation.y += 0.0008;

    camera.position.x += (pointerX - camera.position.x * 0.02) * 0.03;
    camera.position.y += (-pointerY - camera.position.y * 0.02) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();
