import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as d3 from 'd3';

// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/// Set up basic scene parameters
camera.position.z = 300;
camera.position.y = 180;
camera.position.x = 0;
scene.background = new THREE.Color(0x111827);

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 120;
controls.maxDistance = 500;

// UI Elements
const panel = document.createElement('div');
panel.id = 'panel';
panel.innerHTML = `
  <div class="panel-section">
    <h2>Camera</h2>
    <div><span class="label">Position X:</span> <span id="camX">0</span></div>
    <div><span class="label">Position Y:</span> <span id="camY">0</span></div>
    <div><span class="label">Position Z:</span> <span id="camZ">0</span></div>
  </div>
  <div class="panel-section">
    <h2>Controls</h2>
    <div><span class="label">Azimuth:</span> <span id="azimuth">0</span>°</div>
    <div><span class="label">Polar Angle:</span> <span id="polar">0</span>°</div>
    <div><span class="label">Distance:</span> <span id="distance">0</span></div>
  </div>
  <div class="panel-section">
    <h2>Scene</h2>
    <div><span class="label">FPS:</span> <span id="fps">0</span></div>
    <div><span class="label">Objects:</span> <span id="objects">0</span></div>
  </div>
  <div class="panel-section">
    <h2>Light</h2>
    <div><span class="label">Intensity:</span> <span id="intensity">1.0</span></div>
    <div><span class="label">Position X:</span> <span id="lightX">0</span></div>
    <div><span class="label">Position Y:</span> <span id="lightY">0</span></div>
    <div><span class="label">Position Z:</span> <span id="lightZ">0</span></div>
  </div>
  <div class="panel-section">
    <h2>Globe</h2>
    <div><span class="label">Radius:</span> <span id="radius">100</span></div>
    <div><span class="label">Segments:</span> <span id="segments">36</span></div>
    <div><span class="label">Rotation:</span> <span id="rotation">0</span>°</div>
  </div>
`;
document.body.appendChild(panel);

const coordInfo = document.createElement('div');
coordInfo.className = 'coordinate-info';
coordInfo.innerHTML = `
  <h2>Coordinates</h2>
  <div><span class="label">Globe:</span> <span id="globeLat">-</span>, <span id="globeLon">-</span></div>
  <div><span class="label">Scene:</span> <span id="sceneX">-</span>, <span id="sceneY">-</span>, <span id="sceneZ">-</span></div>
`;
document.body.appendChild(coordInfo);



// Create a transparent globe with graticule
const radius = 100;
const segments = 36;

// Create the globe graticule
const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);
const globeMaterial = new THREE.MeshBasicMaterial({
  color: 0x3a86ff,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Create graticule lines using D3 geo paths
const graticule = d3.geoGraticule().step([15, 15])();
const graticuleMaterial = new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0 });

graticule.coordinates.forEach(coord => {
  const points = [];
  coord.forEach(point => {
      // point = [lon, lat] from d3
      const lon = point[0];
      const lat = point[1];

      // lat/lon in radians
      const latRad = THREE.MathUtils.degToRad(lat);
      const lonRad = THREE.MathUtils.degToRad(lon);

      const x = radius * Math.cos(latRad) * Math.cos(lonRad);
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.sin(lonRad);
    
    points.push(new THREE.Vector3(x, y, z));
  });
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, graticuleMaterial);
  scene.add(line);
});

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 200, 200);
scene.add(directionalLight);

// Helper function to convert lat/lon to 3D coordinates
function latLonToVector3(latDeg, lonDeg, radius) {
  // Convert degrees to radians
  const latRad = THREE.MathUtils.degToRad(latDeg);
  const lonRad = THREE.MathUtils.degToRad(lonDeg);

  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = - radius * Math.cos(latRad) * Math.sin(lonRad);

  return new THREE.Vector3(x, y, z);
}


// Load points data from JSON file
let points = [];

fetch('data/points.json')
  .then(response => response.json())
  .then(data => {
    points = data;
    createPointMarkers();
  })
  .catch(error => console.error('Error loading points data:', error));

// Function to create markers for all points
function createPointMarkers() {
  points.forEach(point => {
    const position = latLonToVector3(point.lat, point.lon, radius);
    
    // Create marker
    const markerGeometry = new THREE.SphereGeometry(.6, 8, 8);

    // Sphere geometry for markers
    // You can use different geometries like BoxGeometry or CylinderGeometry
    // to create different shapes for markers
    // For example, to create a cylinder:
    // const markerGeometry = new THREE.CylinderGeometry(0.4, 0.4, height, 8);
    // Calculate the normalized direction from center to this point
    const direction = position.clone().normalize();

    // Use the value to determine the height
    const height = point.value;
    
    // Create a cylinder/bar extending from the surface
    const barGeometry = new THREE.CylinderGeometry(0.4, 0.4, height, 8);
    const barMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff5b5b,
      // Optional: You can use the value to determine color
      // color: new THREE.Color().setHSL(Math.max(0, Math.min(1, 1 - point.value / 10)), 1, 0.5)
    });

    const bar = new THREE.Mesh(barGeometry, barMaterial);
    
    // Position and orient the bar
    // Place the base at the globe surface
    const barPosition = position.clone();
    
    // Move the cylinder so its base is at the surface
    // The cylinder's origin is at its center, so move it out by half its height
    barPosition.add(direction.multiplyScalar(height / 2));
    bar.position.copy(barPosition);
    
    // Orient the bar to point away from the center
    bar.lookAt(new THREE.Vector3(0, 0, 0));
    // Rotate 90 degrees because cylinders in Three.js have their length along the Y axis
    bar.rotateX(Math.PI / 2);
    
    // You can optionally use the value property to adjust marker color or size
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5b5b });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position);

    // Ad marker and bar to the scene
    scene.add(marker)
    // scene.add(bar); 
    
    // Create label using HTML and CSS
    const labelDiv = document.createElement('div');
    labelDiv.className = 'point-label'; // Updated class name
    labelDiv.textContent = point.name;
    labelDiv.style.position = 'absolute';
    labelDiv.style.display = 'none'; // Initially hidden
    document.body.appendChild(labelDiv);
    
    // Store reference to DOM element
    marker.userData = {
      labelElement: labelDiv,
      point: point // Store the full point data
    };
  });
}


// Set up raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;

// Add event listeners
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  // Get the canvas bounding rectangle in the page:
  const rect = renderer.domElement.getBoundingClientRect();

  // event.clientX/Y are relative to the *page*, so subtract the
  // canvas’s top-left corner to get local coordinates:
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Now convert from [0..canvasWidth] to [-1..+1], and [0..canvasHeight] to [+1..-1]:
  mouse.x = (mouseX / rect.width) * 2 - 1;
  mouse.y = -(mouseY / rect.height) * 2 + 1;

  // Finally, set up the ray:
  raycaster.setFromCamera(mouse, camera);
  
  // Calculate intersections with the globe
  const intersects = raycaster.intersectObject(globe);
  
  if (intersects.length > 0) {
    const point = intersects[0].point.clone().normalize().multiplyScalar(radius);
  
    // lat/lon in radians:
    const latRad = Math.asin(point.y / radius);
    const lonRad = Math.atan2(point.z, point.x);
    
    const latDeg = THREE.MathUtils.radToDeg(latRad);
    const lonDeg = THREE.MathUtils.radToDeg(lonRad);
  
    document.getElementById('globeLat').textContent = latDeg.toFixed(2) + '°';
    document.getElementById('globeLon').textContent = lonDeg.toFixed(2) + '°';  
    document.getElementById('sceneX').textContent = point.x.toFixed(2);
    document.getElementById('sceneY').textContent = point.y.toFixed(2);
    document.getElementById('sceneZ').textContent = point.z.toFixed(2);
  } else {
    // Reset coordinate display when not hovering over the globe
    document.getElementById('globeLat').textContent = '-';
    document.getElementById('globeLon').textContent = '-';
    document.getElementById('sceneX').textContent = '-';
    document.getElementById('sceneY').textContent = '-';
    document.getElementById('sceneZ').textContent = '-';
  }
  
  // Check for intersections with city markers
  const allObjects = scene.children.filter(obj => obj.type === 'Mesh' && obj !== globe);
  const markerIntersects = raycaster.intersectObjects(allObjects);
  
  // Reset previously highlighted marker
  if (intersectedObject) {
    if (intersectedObject.userData && intersectedObject.userData.labelElement) {
      intersectedObject.userData.labelElement.style.display = 'none';
    }
    intersectedObject = null;
  }
  
  // Highlight new marker
  if (markerIntersects.length > 0) {
    intersectedObject = markerIntersects[0].object;
    if (intersectedObject.userData && intersectedObject.userData.labelElement) {
      const labelElement = intersectedObject.userData.labelElement;
      labelElement.style.display = 'block';
      
      // Position the label based on the marker's screen position
      const vector = new THREE.Vector3();
      vector.copy(intersectedObject.position);
      vector.project(camera);
      
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
      
      labelElement.style.left = `${x}px`;
      labelElement.style.top = `${y - 30}px`; // Offset to show above marker
    }
  }
}

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
const fpsUpdateInterval = 1000; // Update FPS every second

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.update();
  
  // Update panel info
  updatePanelInfo();
  
  // Calculate FPS
  frameCount++;
  const currentTime = performance.now();
  if (currentTime - lastTime > fpsUpdateInterval) {
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    document.getElementById('fps').textContent = fps;
    frameCount = 0;
    lastTime = currentTime;
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

function updatePanelInfo() {
  // Camera position
  document.getElementById('camX').textContent = camera.position.x.toFixed(2);
  document.getElementById('camY').textContent = camera.position.y.toFixed(2);
  document.getElementById('camZ').textContent = camera.position.z.toFixed(2);
  
  // Controls info
  const azimuth = Math.atan2(camera.position.x, camera.position.z) * (180 / Math.PI);
  const polar = Math.acos(camera.position.y / camera.position.length()) * (180 / Math.PI);
  document.getElementById('azimuth').textContent = (azimuth + 180).toFixed(2);
  document.getElementById('polar').textContent = polar.toFixed(2);
  document.getElementById('distance').textContent = camera.position.length().toFixed(2);
  
  // Scene info
  document.getElementById('objects').textContent = scene.children.length;
  
  // Light info
  document.getElementById('intensity').textContent = directionalLight.intensity.toFixed(2);
  document.getElementById('lightX').textContent = directionalLight.position.x.toFixed(2);
  document.getElementById('lightY').textContent = directionalLight.position.y.toFixed(2);
  document.getElementById('lightZ').textContent = directionalLight.position.z.toFixed(2);
  
  // Globe info
  document.getElementById('radius').textContent = radius.toFixed(2);
  document.getElementById('segments').textContent = segments;
  document.getElementById('rotation').textContent = (globe.rotation.y * (180 / Math.PI)).toFixed(2);
}

// Start animation
animate();