// Three.js book scene with golden metallic effect on yellow
(async function() {
  const THREE = await import('https://esm.sh/three@0.170.0');

  const canvas = document.getElementById('bookCanvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  // Setup
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(rect.width, rect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const camera = new THREE.PerspectiveCamera(40, rect.width / rect.height, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Lighting for metallic reflections
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
  fillLight.position.set(-5, 3, -3);
  scene.add(fillLight);

  const goldLight = new THREE.PointLight(0xffd700, 0.6, 10);
  goldLight.position.set(2, 0, 3);
  scene.add(goldLight);

  // Book dimensions: 12.5 x 17.5 cm cover, 1.3 cm spine
  const bookWidth = 2.5;      // cover width
  const bookHeight = 3.5;     // cover height
  const bookDepth = 0.052;    // spine thickness (very thin!)

  // Load textures
  const loader = new THREE.TextureLoader();
  const frontTex = await loader.loadAsync('/assets/book-front.png');
  const backTex = await loader.loadAsync('/assets/book-back.png');
  const spineTex = await loader.loadAsync('/assets/book-spine.png');

  // Custom shader for golden metallic yellow
  const goldShaderMaterial = (texture) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        lightPos: { value: new THREE.Vector3(5, 5, 5) },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 lightPos;
        uniform float time;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vec4 texColor = texture2D(map, vUv);
          vec3 color = texColor.rgb;

          // Detect yellow/gold: high R, high G, low B
          float r = color.r;
          float g = color.g;
          float b = color.b;

          // More sensitive yellow detection
          float isGold = step(0.6, r) * step(0.45, g) * (1.0 - step(0.55, b));
          float goldAmount = isGold * clamp((r + g - b * 1.5) * 0.8, 0.0, 1.0);

          // Lighting calculations
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          vec3 lightDir = normalize(lightPos - vWorldPosition);
          vec3 halfDir = normalize(lightDir + viewDir);

          // Diffuse
          float diff = max(dot(normal, lightDir), 0.0);

          // Specular - high power for metallic look
          float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

          // Fresnel for edge glow
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

          // Rich gold colors
          vec3 goldBase = vec3(0.95, 0.7, 0.2);
          vec3 goldHighlight = vec3(1.0, 0.92, 0.6);
          vec3 goldReflect = vec3(1.0, 0.85, 0.4);

          // Apply metallic gold to yellow areas
          vec3 metallicColor = color;
          metallicColor = mix(metallicColor, goldBase, goldAmount * 0.5);
          metallicColor += goldHighlight * spec * goldAmount * 2.0;
          metallicColor += goldReflect * fresnel * goldAmount * 1.2;

          // Add subtle diffuse lighting to all areas
          metallicColor *= (0.6 + diff * 0.5);

          // Add specular to non-gold areas too (subtle)
          metallicColor += vec3(1.0) * spec * 0.15 * (1.0 - goldAmount);

          gl_FragColor = vec4(metallicColor, texColor.a);
        }
      `,
      side: THREE.DoubleSide,
    });
  };

  // Gold page edge material
  const goldPageMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a84b,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 2,
  });

  // Create materials array [right, left, top, bottom, front, back]
  const materials = [
    goldPageMaterial,                    // right - page edges
    goldShaderMaterial(spineTex),        // left - spine
    goldPageMaterial,                    // top - page edges
    goldPageMaterial,                    // bottom - page edges
    goldShaderMaterial(frontTex),        // front cover
    goldShaderMaterial(backTex),         // back cover
  ];

  const geometry = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
  const book = new THREE.Mesh(geometry, materials);
  scene.add(book);

  book.rotation.y = 0.3;
  book.rotation.x = 0.1;

  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    // Update shader time uniform
    materials.forEach(mat => {
      if (mat.uniforms && mat.uniforms.time) {
        mat.uniforms.time.value = time;
      }
    });

    // Gentle rotation
    book.rotation.y = Math.sin(time * 0.3) * 0.1 + 0.3;

    renderer.render(scene, camera);
  }
  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    const newRect = canvas.getBoundingClientRect();
    camera.aspect = newRect.width / newRect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(newRect.width, newRect.height);
  });
})();
