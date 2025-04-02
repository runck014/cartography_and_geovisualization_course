import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set background color (space)
scene.background = new THREE.Color(0x000000);

// Create a sphere for the Earth
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Create a basic material with earth texture
// Load from Content Delivery Network (CDN)
const earthMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
});

// Alternatively, do solid color
// const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff01 });

// Create the Earth mesh
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Position the camera
camera.position.z = 15;

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light (sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.minDistance = 7; // Set minimum zoom distance
controls.maxDistance = 30; // Set maximum zoom distance


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the Earth
    // earth.rotation.y += 0.005;
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

// Start the animation loop
animate();