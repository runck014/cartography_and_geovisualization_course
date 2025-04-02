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

// Add a graticule (grid) on the x,y plane below the Earth
function createGraticule() {
  const gridSize = 30;
  const gridDivisions = 30;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x444444, 0x888888);
  
  // Position the grid below the Earth (Earth is at 0,0,0 with radius 5)
  gridHelper.position.y = -6; // Position just below the Earth's bottom
  
  // Store the size and divisions as custom properties
  gridHelper.userData.size = gridSize;
  gridHelper.userData.divisions = gridDivisions;
  
  scene.add(gridHelper);
  return gridHelper;
}

const graticule = createGraticule();

// Add x, y, z axes
function createAxes() {
  const axesLength = 10;
  const axesHelper = new THREE.AxesHelper(axesLength);
  // X axis is red, Y axis is green, Z axis is blue
  
  // Store the length as a custom property
  axesHelper.userData.length = axesLength;
  
  scene.add(axesHelper);
  return axesHelper;
}

const axes = createAxes();

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

// Create parameters display panel
function createStatsPanel() {
  const statsPanel = document.createElement('div');
  statsPanel.style.position = 'absolute';
  statsPanel.style.top = '10px';
  statsPanel.style.right = '10px';
  statsPanel.style.width = '300px';
  statsPanel.style.padding = '10px';
  statsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  statsPanel.style.color = 'white';
  statsPanel.style.fontFamily = 'monospace';
  statsPanel.style.fontSize = '12px';
  statsPanel.style.borderRadius = '5px';
  statsPanel.style.maxHeight = '80vh';
  statsPanel.style.overflowY = 'auto';
  document.body.appendChild(statsPanel);
  return statsPanel;
}

const statsPanel = createStatsPanel();

// Function to update the stats panel
function updateStatsPanel() {
  // Format vector to string
  const vectorToString = (v) => `x: ${v.x.toFixed(2)}, y: ${v.y.toFixed(2)}, z: ${v.z.toFixed(2)}`;
  
  // Format color to hex
  const colorToHex = (color) => '#' + color.getHexString();

  let stats = '<h3 style="margin-top: 0">Scene Parameters</h3>';
  
  // Camera parameters
  stats += '<h4>Camera:</h4>';
  stats += `<div>Type: PerspectiveCamera</div>`;
  stats += `<div>FOV: ${camera.fov}°</div>`;
  stats += `<div>Aspect: ${camera.aspect.toFixed(2)}</div>`;
  stats += `<div>Near: ${camera.near}</div>`;
  stats += `<div>Far: ${camera.far}</div>`;
  stats += `<div>Position: ${vectorToString(camera.position)}</div>`;
  
  // Controls parameters
  stats += '<h4>Controls:</h4>';
  stats += `<div>Damping: ${controls.enableDamping}</div>`;
  stats += `<div>Damping Factor: ${controls.dampingFactor}</div>`;
  stats += `<div>Rotate Speed: ${controls.rotateSpeed}</div>`;
  stats += `<div>Min Distance: ${controls.minDistance}</div>`;
  stats += `<div>Max Distance: ${controls.maxDistance}</div>`;
  
  // Scene parameters
  stats += '<h4>Scene:</h4>';
  stats += `<div>Background: ${colorToHex(scene.background)}</div>`;
  stats += `<div>Children: ${scene.children.length}</div>`;
  
  // Earth parameters
  stats += '<h4>Earth:</h4>';
  stats += `<div>Geometry: SphereGeometry</div>`;
  stats += `<div>- Radius: ${earthGeometry.parameters.radius}</div>`;
  stats += `<div>- Width Segments: ${earthGeometry.parameters.widthSegments}</div>`;
  stats += `<div>- Height Segments: ${earthGeometry.parameters.heightSegments}</div>`;
  stats += `<div>Position: ${vectorToString(earth.position)}</div>`;
  stats += `<div>Rotation: ${vectorToString(earth.rotation)}</div>`;
  stats += `<div>Material: MeshBasicMaterial</div>`;
  stats += `<div>- Texture: Earth</div>`;
  
  // Graticule parameters
  stats += '<h4>Graticule:</h4>';
  stats += `<div>Size: ${graticule.userData.size}</div>`;
  stats += `<div>Divisions: ${graticule.userData.divisions}</div>`;
  stats += `<div>Position: ${vectorToString(graticule.position)}</div>`;
  
  // Axes parameters
  stats += '<h4>Axes:</h4>';
  stats += `<div>Length: ${axes.userData.length}</div>`;
  stats += `<div>Red: X-axis</div>`;
  stats += `<div>Green: Y-axis</div>`;
  stats += `<div>Blue: Z-axis</div>`;
  
  // Lights parameters
  stats += '<h4>Lights:</h4>';
  stats += `<div>Ambient Light:</div>`;
  stats += `<div>- Color: ${colorToHex(ambientLight.color)}</div>`;
  stats += `<div>- Intensity: ${ambientLight.intensity}</div>`;
  
  stats += `<div>Directional Light:</div>`;
  stats += `<div>- Color: ${colorToHex(directionalLight.color)}</div>`;
  stats += `<div>- Intensity: ${directionalLight.intensity}</div>`;
  stats += `<div>- Position: ${vectorToString(directionalLight.position)}</div>`;
  
  // Renderer parameters
  stats += '<h4>Renderer:</h4>';
  stats += `<div>Size: ${renderer.domElement.width} x ${renderer.domElement.height}</div>`;
  
  statsPanel.innerHTML = stats;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.update();
  
  // Update stats panel
  updateStatsPanel();
  
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