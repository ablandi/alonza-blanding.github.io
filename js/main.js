import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Background animation
const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const backgroundRenderer = new THREE.WebGLRenderer({ alpha: true });
backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background-canvas').appendChild(backgroundRenderer.domElement);

// Create grid of particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x05d9e8,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
backgroundScene.add(particlesMesh);
backgroundCamera.position.z = 2;

// Character setup
const characterCanvas = document.getElementById('character');
const characterScene = new THREE.Scene();
const characterCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const characterRenderer = new THREE.WebGLRenderer({
    canvas: characterCanvas,
    alpha: true,
    antialias: true
});
characterRenderer.setSize(400, 400);
characterRenderer.setClearColor(0x000000, 0);
characterRenderer.shadowMap.enabled = true;
characterRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add orbit controls for character view
const controls = new OrbitControls(characterCamera, characterCanvas);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 4;
controls.enableDamping = true;

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
characterScene.add(ambientLight);

const frontLight = new THREE.DirectionalLight(0xff2a6d, 1); // Neon pink
frontLight.position.set(0, 2, 5);
frontLight.castShadow = true;
characterScene.add(frontLight);

const backLight = new THREE.DirectionalLight(0x05d9e8, 1); // Neon blue
backLight.position.set(0, 2, -5);
backLight.castShadow = true;
characterScene.add(backLight);

const rimLight = new THREE.DirectionalLight(0x7700ff, 0.5); // Neon purple
rimLight.position.set(5, 0, 0);
characterScene.add(rimLight);

// Create hologram effect
const createHologramMaterial = () => {
    return new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            baseColor: { value: new THREE.Color(0x05d9e8) },
            glowColor: { value: new THREE.Color(0xff2a6d) },
            rimColor: { value: new THREE.Color(0x7700ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 baseColor;
            uniform vec3 glowColor;
            uniform vec3 rimColor;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                // Hologram scan line effect
                float scanLine = sin(vPosition.y * 20.0 + time * 2.0) * 0.1 + 0.9;
                
                // Rim lighting effect
                float rimFactor = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
                rimFactor = pow(rimFactor, 3.0);
                
                // Glitch effect
                float glitch = step(0.98, sin(time * 100.0 + vPosition.y * 30.0));
                
                // Combine effects
                vec3 color = mix(baseColor, glowColor, rimFactor);
                color = mix(color, rimColor, glitch);
                color *= scanLine;
                
                gl_FragColor = vec4(color, 0.9);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
};

// Load V model
const loader = new GLTFLoader();
let character;
const hologramMaterial = createHologramMaterial();

loader.load(
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf', // Placeholder model
    (gltf) => {
        character = gltf.scene;
        character.traverse((node) => {
            if (node.isMesh) {
                node.material = hologramMaterial;
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        // Position and scale the model
        character.scale.set(0.5, 0.5, 0.5);
        character.position.set(0, -1, 0);
        characterScene.add(character);
        
        // Set initial camera position
        characterCamera.position.set(0, 0, 5);
        characterCamera.lookAt(0, 0, 0);
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error);
    }
);

// Add cyberpunk environment
const createEnvironment = () => {
    // Ground plane with grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x05d9e8, 0xff2a6d);
    gridHelper.position.y = -1;
    characterScene.add(gridHelper);

    // Background cyber circles
    const ringGeometry = new THREE.RingGeometry(1.5, 1.6, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x7700ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.position.z = -2;
    ring1.rotation.x = Math.PI / 4;
    characterScene.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring2.position.z = -2;
    ring2.scale.set(1.2, 1.2, 1.2);
    ring2.rotation.x = -Math.PI / 4;
    characterScene.add(ring2);
};

createEnvironment();

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    
    // Update hologram effect
    time += 0.016;
    if (character) {
        hologramMaterial.uniforms.time.value = time;
    }
    
    // Update controls
    controls.update();
    
    // Render both scenes
    backgroundRenderer.render(backgroundScene, backgroundCamera);
    characterRenderer.render(characterScene, characterCamera);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Update background
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    backgroundCamera.aspect = width / height;
    backgroundCamera.updateProjectionMatrix();
    backgroundRenderer.setSize(width, height);
    
    // Update character (maintain aspect ratio)
    const characterWidth = Math.min(400, width * 0.8);
    const characterHeight = characterWidth;
    characterRenderer.setSize(characterWidth, characterHeight);
});

// Start animation
animate();

// Scroll animations
const sections = document.querySelectorAll('.cyber-section');

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Add parallax effect to fire image
document.addEventListener('mousemove', (e) => {
    const character = document.querySelector('.cyber-character');
    const container = document.querySelector('.character-container');
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position relative to container center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / 30;
    const deltaY = (e.clientY - centerY) / 30;
    
    // Apply transform
    character.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
});

// Add glitch effect on hover
const glitchText = document.querySelector('.glitch');
let glitchInterval;

glitchText.addEventListener('mouseenter', () => {
    glitchInterval = setInterval(() => {
        const glitchChance = Math.random();
        if (glitchChance < 0.5) {
            glitchText.style.textShadow = `
                ${Math.random() * 10}px ${Math.random() * 10}px #ff2a6d,
                ${Math.random() * -10}px ${Math.random() * 10}px #05d9e8
            `;
            setTimeout(() => {
                glitchText.style.textShadow = '';
            }, 50);
        }
    }, 100);
});

glitchText.addEventListener('mouseleave', () => {
    clearInterval(glitchInterval);
    glitchText.style.textShadow = '';
});

// Add smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Add cyber glow effect on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.cyber-section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75) && (rect.bottom >= 0);
        
        if (isVisible) {
            section.style.borderColor = 'var(--neon-pink)';
            section.style.boxShadow = '0 0 20px rgba(255, 42, 109, 0.3)';
        } else {
            section.style.borderColor = 'var(--neon-blue)';
            section.style.boxShadow = '0 0 20px rgba(5, 217, 232, 0.3)';
        }
    });
});
