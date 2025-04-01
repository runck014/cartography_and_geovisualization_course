// Import the Three.js library and its features
// Three.js is a JavaScript 3D library that makes WebGL simpler to use
import * as THREE from 'three';
// OrbitControls is an additional module that allows us to rotate/pan the camera around an object
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// === BASIC THREE.JS SETUP ===
// Three.js requires three main components to render anything:
// 1. Scene - this is like a container where we put all our objects, lights, cameras, etc.
// 2. Camera - this defines how we view the scene (like our eyes or a movie camera)
// 3. Renderer - this draws everything to the screen using WebGL

// Create a scene - think of this as your virtual 3D world or a stage for all your 3D objects
const scene = new THREE.Scene();
// Set the background color of the scene to black (colors in Three.js use hexadecimal format)
scene.background = new THREE.Color(0x000000); // 0x000000 is black

// Set up the camera - this determines how we view the scene
// PerspectiveCamera creates a view that mimics how human eyes see (things farther away appear smaller)
// Parameters: Field of View (in degrees), Aspect Ratio, Near clipping plane, Far clipping plane
const camera = new THREE.PerspectiveCamera(
    75, // Field of view: Higher values give a wider view but more distortion
    window.innerWidth / window.innerHeight, // Aspect ratio: Should match your display area
    0.1, // Near clipping plane: Objects closer than this won't be rendered
    1000 // Far clipping plane: Objects farther than this won't be rendered
);
// Position the camera in 3D space (x, y, z coordinates)
// Positive z moves the camera backward, positive y moves it upward, positive x moves it to the right
camera.position.z = 15; // Move the camera 15 units away from the center
camera.position.y = 5;  // Move the camera 5 units up
camera.position.x = 0;  // Keep the camera centered horizontally

// Create a renderer - this is what draws everything to the screen
// WebGLRenderer uses your GPU to render 3D graphics efficiently
const renderer = new THREE.WebGLRenderer({ 
    antialias: true // Enable antialiasing for smoother edges
});
// Set the size of the renderer to match the window size
renderer.setSize(window.innerWidth, window.innerHeight);
// Set the pixel ratio to match the device (helps with high-DPI displays)
// We limit it to 2 to prevent performance issues on very high-DPI devices
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Add the renderer's canvas element to the HTML body
// This is what you'll actually see on screen - THREE.js renders to this canvas
document.body.appendChild(renderer.domElement);

// === CONTROLS ===
// Add OrbitControls to let users interact with the scene by dragging to rotate, zoom, pan
const controls = new OrbitControls(camera, renderer.domElement);
// Enable damping for smoother camera movement (adds inertia)
controls.enableDamping = true;
// Set how much the movement slows down (lower values = more inertia)
controls.dampingFactor = 0.05;

// === GALAXY PARAMETERS ===
// Define all the parameters for our galaxy in one object for easy reference
const parameters = {
    count: 50000,         // Number of stars/particles
    size: 0.01,           // Size of each star
    radius: 5,            // Radius of the galaxy
    branches: 5,          // Number of spiral arms
    spin: 1,              // How much the spiral arms curve
    randomness: 0.2,      // How much stars deviate from perfect spiral arms
    randomnessPower: 3,   // Controls the distribution of randomness (higher = more stars near center)
    insideColor: 0xff6030, // Color of stars near center (orange/red)
    outsideColor: 0x1b3984 // Color of stars at the edge (blue)
};

// Variables to store our galaxy components so we can modify them later
let geometry = null;  // Will store the shape/positions data
let material = null;  // Will store how the stars look (size, color, etc.)
let points = null;    // Will be the actual object added to the scene

// === GALAXY CREATION FUNCTION ===
// This function creates (or recreates) the entire galaxy
const generateGalaxy = () => {
    // First, clean up any existing galaxy to prevent memory leaks
    // This is important if we regenerate the galaxy multiple times
    if (points !== null) {
        geometry.dispose(); // Free up GPU memory
        material.dispose(); // Free up GPU memory
        scene.remove(points); // Remove the object from the scene
    }

    // === GEOMETRY ===
    // Create the geometry that will store all star positions and colors
    // BufferGeometry is an efficient way to store large numbers of vertices
    geometry = new THREE.BufferGeometry();
    
    // Create arrays to store positions and colors
    // Each star needs 3 values for position (x, y, z) and 3 for color (r, g, b)
    // We use Float32Array for better performance with the GPU
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    
    // Create color objects from our parameters
    // We'll use these to create a gradient from inside to outside
    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);
    
    // === GENERATE EACH STAR ===
    // Loop through and create each star
    for (let i = 0; i < parameters.count; i++) {
        // Calculate the base index for this star in our arrays (each star has 3 values)
        const i3 = i * 3;
        
        // --- POSITION CALCULATION ---
        // Calculate a random radius from the center (distance from center)
        const radius = Math.random() * parameters.radius;
        
        // Calculate the spin angle - stars farther out spin more to create the spiral
        const spinAngle = radius * parameters.spin;
        
        // Calculate which branch this star belongs to
        // We divide the full circle (2π radians) evenly among the branches
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        
        // Add randomness to each coordinate to make the galaxy look natural
        // Math.pow makes the randomness stronger near the center (based on randomnessPower)
        // The ternary operator (? :) randomly makes the offset positive or negative
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        
        // Calculate final position with spiral pattern plus randomness
        // The Math.cos and Math.sin functions create the circular/spiral pattern
        positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX; // x position
        positions[i3 + 1] = randomY;                                             // y position
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // z position
        
        // --- COLOR CALCULATION ---
        // Create a mixed color between inside and outside based on radius
        // clone() makes a copy so we don't modify the original colors
        const mixedColor = insideColor.clone();
        // lerp() linearly interpolates between two colors based on a factor (0-1)
        // This creates a smooth gradient from the inside color to the outside color
        mixedColor.lerp(outsideColor, radius / parameters.radius);
        
        // Assign the calculated color to this star
        colors[i3]     = mixedColor.r; // Red component
        colors[i3 + 1] = mixedColor.g; // Green component
        colors[i3 + 2] = mixedColor.b; // Blue component
    }
    
    // Add the position and color data to our geometry
    // BufferAttribute tells Three.js how to interpret our data (3 values per vertex)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // === MATERIAL ===
    // Create the material that defines how our stars look
    material = new THREE.PointsMaterial({
        size: parameters.size,           // Size of each star
        sizeAttenuation: true,           // Stars get smaller with distance (perspective)
        depthWrite: false,               // Don't write to depth buffer (helps with transparency)
        blending: THREE.AdditiveBlending, // Colors add together when overlapping (creates glow)
        vertexColors: true               // Use the colors we defined for each vertex
    });
    
    // === PUTTING IT ALL TOGETHER ===
    // Create the final points object that combines our geometry and material
    // Points renders the geometry as individual points/particles
    points = new THREE.Points(geometry, material);
    // Add our galaxy to the scene so it will be rendered
    scene.add(points);
};

// Call the function to generate our galaxy
generateGalaxy();

// === HANDLING WINDOW RESIZE ===
// Make sure our 3D scene looks correct if the window size changes
window.addEventListener('resize', () => {
    // Get the new window dimensions
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    // Update the camera's aspect ratio to match the new dimensions
    camera.aspect = newWidth / newHeight;
    // Tell the camera to update its projection matrix with the new aspect ratio
    camera.updateProjectionMatrix();
    
    // Update the renderer's size to match the new dimensions
    renderer.setSize(newWidth, newHeight);
    // Update the pixel ratio in case device orientation changed
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// === ANIMATION LOOP ===
// Create a clock to track time for animations
const clock = new THREE.Clock();

// The animation function runs continuously to update and render the scene
function animate() {
    // Get the time elapsed since the clock started
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate the galaxy slowly over time
    if (points) {
        // Rotate around the Y axis (vertical axis)
        points.rotation.y = elapsedTime * 0.05; // Multiplier controls rotation speed
    }
    
    // Update the orbit controls (needed for the damping/inertia effect)
    controls.update();
    
    // Render the scene from the camera's perspective
    // This is what actually draws everything to the screen
    renderer.render(scene, camera);
    
    // Request the next frame to continue the animation loop
    // This creates a smooth, optimized animation cycle
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();
