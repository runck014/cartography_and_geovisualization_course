// Import the Three.js library
// Three.js is a 3D library that simplifies WebGL programming
import * as THREE from 'three';

// Import OrbitControls from Three.js examples
// OrbitControls allows us to move the camera around an object using the mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ===== STEP 1: CREATING THE SCENE =====
// A scene is a container for all 3D objects, lights, and cameras
// Think of it as a virtual "world" or "stage" for your 3D content
const scene = new THREE.Scene();

// Set the background color of the scene to black
// Colors in Three.js are often represented in hexadecimal format (0x000000 = black)
scene.background = new THREE.Color(0x000000);

// ===== STEP 2: SETTING UP THE CAMERA =====
// The camera defines what we can see - it's our "eye" into the 3D world
// A PerspectiveCamera mimics how human eyes see - things farther away appear smaller
// Parameters:
// 1. Field of View (FOV) in degrees - how wide our view is (like a wide-angle lens)
// 2. Aspect Ratio - typically set to match the browser window dimensions
// 3. Near clipping plane - objects closer than this won't be visible
// 4. Far clipping plane - objects farther than this won't be visible
const camera = new THREE.PerspectiveCamera(
    75,                                     // 75-degree field of view
    window.innerWidth / window.innerHeight, // Match the screen's aspect ratio
    0.1,                                    // Near clipping plane
    1000                                    // Far clipping plane
);

// Position the camera in 3D space
// By default, the camera and all objects are placed at (0,0,0)
// We need to move the camera back to see anything
camera.position.z = 5; // Move camera 5 units away from the center along the z-axis

// ===== STEP 3: CREATING THE RENDERER =====
// The renderer is what draws (renders) our 3D scene onto a 2D canvas in the browser
// WebGLRenderer uses WebGL, which leverages your GPU for hardware-accelerated rendering
const renderer = new THREE.WebGLRenderer();

// Set the renderer size to match the browser window
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer's canvas element to the HTML document
// This is the actual DOM element that displays our 3D graphics
document.body.appendChild(renderer.domElement);

// ===== STEP 4: CREATING A SQUARE (BOX GEOMETRY) =====
// In Three.js, a 3D object consists of:
// 1. Geometry - the shape/structure (coordinates in space)
// 2. Material - the appearance (color, texture, reflection properties)
// These combine to create a Mesh object

// BoxGeometry creates a cube/box shape
// Parameters: width, height, depth
// To make a flat square, we use a very small depth value
const geometry = new THREE.BoxGeometry(
    2,    // 2 units wide (x-axis)
    2,    // 2 units tall (y-axis)
    0.1   // 0.1 units deep (z-axis) - very thin to appear like a square
);

// Create a material to define how our square looks
// MeshStandardMaterial is physically based and reacts realistically to lights
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ff00,         // Bright green color (RGB: 0, 255, 0)
    side: THREE.DoubleSide    // Make the material visible from both sides
});

// Combine the geometry and material to create a mesh object
// The mesh is what we actually add to the scene and render
const square = new THREE.Mesh(geometry, material);

// Add the square to our scene
scene.add(square);

// ===== STEP 5: ADDING LIGHTS =====
// MeshStandardMaterial needs light to be visible, unlike MeshBasicMaterial
// Without lights, the square would be completely black

// AmbientLight provides an omnidirectional light that illuminates all objects equally
// It's like the general brightness of a room - it doesn't cast shadows
// Parameters: color, intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // White light at half intensity
scene.add(ambientLight);

// DirectionalLight simulates distant light source like the sun
// It shines from a specific direction and creates shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light at full intensity
// Position the light - it will shine in the direction of the origin (0,0,0) from this position
directionalLight.position.set(5, 5, 5); // Position it up, right, and behind the camera
scene.add(directionalLight);

// ===== STEP 6: ADDING ORBIT CONTROLS =====
// OrbitControls allow us to navigate around the scene with the mouse
// It needs to know which camera to control and which DOM element to listen to for mouse events
const controls = new OrbitControls(camera, renderer.domElement);

// Enable damping for smoother movement when rotating/zooming
controls.enableDamping = true;
// Damping factor controls the "inertia" - how gradually movement slows down
controls.dampingFactor = 0.05;

// ===== STEP 7: HANDLING WINDOW RESIZING =====
// When the user resizes their browser window, we need to update our scene
window.addEventListener('resize', () => {
    // Get the new window dimensions
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    // Update the camera's aspect ratio to match the new window dimensions
    camera.aspect = newWidth / newHeight;
    // When changing the camera's properties, we need to update its projection matrix
    camera.updateProjectionMatrix();
    
    // Update the renderer's size to match the new window dimensions
    renderer.setSize(newWidth, newHeight);
});

// ===== STEP 8: CREATING THE ANIMATION LOOP =====
// To create smooth animations and interaction, we need to continuously render frames
function animate() {
    // requestAnimationFrame is a browser API that calls a function before the next repaint
    // It automatically pauses when the user navigates to another browser tab
    // This creates a loop that runs at about 60fps (frames per second) in most browsers
    requestAnimationFrame(animate);
    
    // If we want to animate our square automatically, we could add something like:
    // square.rotation.x += 0.01;
    // square.rotation.y += 0.01;
    
    // Update the orbit controls
    // This is needed for the damping effect to work
    controls.update();
    
    // Render the scene from the camera's current perspective
    // This draws the current frame to the screen
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
