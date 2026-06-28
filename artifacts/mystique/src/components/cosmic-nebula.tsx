
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Renders a dynamic, animated cosmic nebula background using Three.js.
 * This component is designed to be fixed to the background and not interfere
 * with any other page content.
 */
export default function CosmicNebula() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    // Limit pixel ratio for performance on high-density displays
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 
    renderer.setClearColor(0x000000, 1) // Black background
    mountRef.current.appendChild(renderer.domElement)

    // Position camera
    camera.position.z = 30

    // --- Starfield Creation ---
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 5000
    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    const starOpacities = new Float32Array(starCount)
    const starTwinkleSpeeds = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      // Random positions in a sphere for a 3D effect
      const radius = Math.random() * 80 + 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[i3 + 2] = radius * Math.cos(phi)
      
      starSizes[i] = Math.random() * 3 + 0.5
      starOpacities[i] = Math.random() * 0.8 + 0.2
      starTwinkleSpeeds[i] = Math.random() * 2 + 0.5
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))
    starGeometry.setAttribute('opacity', new THREE.BufferAttribute(starOpacities, 1))
    starGeometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(starTwinkleSpeeds, 1))

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute float twinkleSpeed;
        varying float vOpacity;
        uniform float time;
        
        void main() {
          vOpacity = opacity * (0.4 + 0.6 * sin(time * twinkleSpeed + position.x * 0.01));
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          float glow = exp(-dist * 4.0);
          gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity * alpha * (0.5 + 0.5 * glow));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // --- Nebula Cloud Creation ---
    const nebulaColors = [0x8B5CF6, 0xC084FC, 0xF472B6] // Purple to pink gradient
    const nebulae: THREE.Points[] = []

    // Helper function for more natural particle distribution
    function gaussianRandom(): number {
      let u = 0, v = 0
      while(u === 0) u = Math.random()
      while(v === 0) v = Math.random()
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    }

    for (let i = 0; i < 3; i++) {
      const nebulaGeometry = new THREE.BufferGeometry()
      const nebulaParticleCount = 2000
      const nebulaPositions = new Float32Array(nebulaParticleCount * 3)
      const nebulaSizes = new Float32Array(nebulaParticleCount)
      const nebulaOpacities = new Float32Array(nebulaParticleCount)

      const centerX = (Math.random() - 0.5) * 40
      const centerY = (Math.random() - 0.5) * 40
      const centerZ = (Math.random() - 0.5) * 40

      for (let j = 0; j < nebulaParticleCount; j++) {
        const j3 = j * 3
        
        // Create cloud-like distribution using gaussian random
        const angle = Math.random() * Math.PI * 2
        const radius = Math.abs(gaussianRandom() * 8 + 3)
        const height = gaussianRandom() * 5
        
        nebulaPositions[j3] = centerX + Math.cos(angle) * radius
        nebulaPositions[j3 + 1] = centerY + Math.sin(angle) * radius
        nebulaPositions[j3 + 2] = centerZ + height
        
        nebulaSizes[j] = Math.abs(gaussianRandom() * 6 + 3)
        nebulaOpacities[j] = Math.abs(gaussianRandom() * 0.2 + 0.05)
      }

      nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3))
      nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1))
      nebulaGeometry.setAttribute('opacity', new THREE.BufferAttribute(nebulaOpacities, 1))

      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(nebulaColors[i]) }
        },
        vertexShader: `
          attribute float size;
          attribute float opacity;
          varying float vOpacity;
          uniform float time;
          
          void main() {
            vOpacity = opacity * (0.6 + 0.4 * sin(time * 0.3 + position.x * 0.01));
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (150.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying float vOpacity;
          
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            float glow = exp(-dist * 3.0);
            gl_FragColor = vec4(color, vOpacity * alpha * glow * 0.8);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })

      const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial)
      scene.add(nebula)
      nebulae.push(nebula)
    }

    // --- Animation Loop ---
    const clock = new THREE.Clock()
    
    const animate = () => {
      const animationFrameId = requestAnimationFrame(animate)
      
      const elapsedTime = clock.getElapsedTime()
      
      // Rotate entire scene slowly for a majestic effect
      scene.rotation.y += 0.0005
      scene.rotation.x += 0.0002
      
      // Update star twinkling shader uniform
      starMaterial.uniforms.time.value = elapsedTime
      
      // Update nebula animations
      nebulae.forEach((nebula, index) => {
        const material = nebula.material as THREE.ShaderMaterial
        material.uniforms.time.value = elapsedTime
        
        // Subtle nebula movement and rotation
        nebula.rotation.x = Math.sin(elapsedTime * 0.05 + index * 2) * 0.05
        nebula.rotation.z = Math.cos(elapsedTime * 0.05 + index * 2) * 0.05
        
        // Gentle floating motion
        nebula.position.y += Math.sin(elapsedTime * 0.1 + index) * 0.01
      })
      
      renderer.render(scene, camera)
    }
    
    animate()

    // --- Event Handlers & Cleanup ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    let currentMount = mountRef.current;
    
    window.addEventListener('resize', handleResize)

    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize)
      if (currentMount) {
        currentMount.removeChild(renderer.domElement)
      }
      
      // Dispose of Three.js objects
      starGeometry.dispose()
      starMaterial.dispose()
      nebulae.forEach(nebula => {
        (nebula.geometry as THREE.BufferGeometry).dispose();
        (nebula.material as THREE.Material).dispose();
      })
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }} // Ensures the background doesn't block clicks
    />
  )
}
