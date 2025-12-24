import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { TextureLoader, ShaderMaterial, DoubleSide } from 'three'
import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import type { Mesh } from 'three'

// Custom shader for golden metallic yellow
const goldShaderMaterial = (texture: THREE.Texture) => {
  return new ShaderMaterial({
    uniforms: {
      map: { value: texture },
      envMap: { value: null },
      metalness: { value: 0.8 },
      roughness: { value: 0.2 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float metalness;
      uniform float roughness;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec4 texColor = texture2D(map, vUv);
        vec3 color = texColor.rgb;

        // Detect yellow/gold: high R, high G, low B
        float r = color.r;
        float g = color.g;
        float b = color.b;

        float isGold = step(0.65, r) * step(0.5, g) * (1.0 - step(0.5, b));
        float goldAmount = isGold * smoothstep(0.0, 1.0, r * 0.5 + g * 0.5 - b);

        // Calculate fake reflection/specular for gold areas
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
        vec3 reflectDir = reflect(-lightDir, normal);

        // Specular highlight
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

        // Fresnel effect for metallic look
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

        // Gold color with metallic sheen
        vec3 goldColor = vec3(0.95, 0.75, 0.25);
        vec3 goldHighlight = vec3(1.0, 0.95, 0.7);

        // Mix in metallic gold effect for yellow pixels
        vec3 metallicGold = mix(color, goldColor, goldAmount * 0.4);
        metallicGold += goldHighlight * spec * goldAmount * 1.5;
        metallicGold += goldHighlight * fresnel * goldAmount * 0.8;

        // Add subtle reflection to non-gold areas too
        vec3 finalColor = metallicGold + vec3(spec * 0.1);

        gl_FragColor = vec4(finalColor, texColor.a);
      }
    `,
    side: DoubleSide,
  })
}

function Book() {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Load textures
  const frontTexture = useLoader(TextureLoader, '/assets/book-front.png')
  const backTexture = useLoader(TextureLoader, '/assets/book-back.png')
  const spineTexture = useLoader(TextureLoader, '/assets/book-spine.png')

  // Create custom materials
  const frontMaterial = useMemo(() => goldShaderMaterial(frontTexture), [frontTexture])
  const backMaterial = useMemo(() => goldShaderMaterial(backTexture), [backTexture])
  const spineMaterial = useMemo(() => goldShaderMaterial(spineTexture), [spineTexture])

  // Book dimensions based on actual cover: 12.5 x 17.5 cm, spine 1.3 cm
  const width = 2.5       // cover width (12.5 cm)
  const height = 3.5      // cover height (17.5 cm)
  const depth = 0.052     // spine: 1.3cm / 12.5cm * 2.5 = 0.26, but visually /5 = 0.052

  // Subtle auto-rotation when not interacting
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + 0.3
    }
  })

  // Gold page edge material
  const goldPageMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d4a84b'),
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 3,
  }), [])

  return (
    <mesh
      ref={meshRef}
      rotation={[0.1, 0.3, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[width, height, depth]} />
      {/* Order: right, left, top, bottom, front, back */}
      <primitive object={goldPageMaterial} attach="material-0" /> {/* Right - page edges */}
      <primitive object={spineMaterial} attach="material-1" /> {/* Left - spine */}
      <primitive object={goldPageMaterial} attach="material-2" /> {/* Top - page edges */}
      <primitive object={goldPageMaterial} attach="material-3" /> {/* Bottom - page edges */}
      <primitive object={frontMaterial} attach="material-4" /> {/* Front cover */}
      <primitive object={backMaterial} attach="material-5" /> {/* Back cover */}
    </mesh>
  )
}

export default function Book3D() {
  return (
    <div className="w-full h-full min-h-[500px]" style={{ cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.4} penumbra={1} />
        <pointLight position={[5, 0, 5]} intensity={0.5} color="#ffd700" />
        <Book />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
