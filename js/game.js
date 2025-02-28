// 3D Pong Game using Three.js

// Game variables
let scene, camera, renderer;
let playerPaddle, aiPaddle, ball, table;
let playerScore = 0, aiScore = 0;
let ballSpeed = 0.05;
let ballDirection = new THREE.Vector3(0.5, 0.5, 0);
let gameStarted = false;
let light;

// Game dimensions
const tableWidth = 20;
const tableHeight = 30;
const paddleWidth = 4;
const paddleHeight = 1;
const paddleDepth = 1;
const ballRadius = 0.5;

// Initialize the game
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Lighting
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 20, 10);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    createGameElements();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    
    // Start animation loop
    animate();
}

// Create game elements
function createGameElements() {
    // Create table
    const tableGeometry = new THREE.BoxGeometry(tableWidth, 0.5, tableHeight);
    const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x1a472a });
    table = new THREE.Mesh(tableGeometry, tableMaterial);
    scene.add(table);
    
    // Add table borders
    createTableBorders();

    // Create paddles
    const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x3498db });
    const aiMaterial = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
    
    playerPaddle = new THREE.Mesh(paddleGeometry, playerMaterial);
    playerPaddle.position.z = tableHeight / 2 - paddleDepth / 2;
    playerPaddle.position.y = paddleHeight / 2;
    scene.add(playerPaddle);
    
    aiPaddle = new THREE.Mesh(paddleGeometry, aiMaterial);
    aiPaddle.position.z = -tableHeight / 2 + paddleDepth / 2;
    aiPaddle.position.y = paddleHeight / 2;
    scene.add(aiPaddle);
    
    // Create ball
    const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.y = ballRadius;
    scene.add(ball);
    
    resetBall();
}

// Create table borders
function createTableBorders() {
    const borderMaterial = new THREE.MeshPhongMaterial({ color: 0x663300 });
    
    // Left border
    const leftBorderGeometry = new THREE.BoxGeometry(1, 1, tableHeight);
    const leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
    leftBorder.position.x = -tableWidth / 2 - 0.5;
    leftBorder.position.y = 0.5;
    scene.add(leftBorder);
    
    // Right border
    const rightBorderGeometry = new THREE.BoxGeometry(1, 1, tableHeight);
    const rightBorder = new THREE.Mesh(rightBorderGeometry, borderMaterial);
    rightBorder.position.x = tableWidth / 2 + 0.5;
    rightBorder.position.y = 0.5;
    scene.add(rightBorder);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    playerPaddle.position.x = mouseX * (tableWidth / 2 - paddleWidth / 2);
}

// Handle key presses
function onKeyDown(event) {
    if (event.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            resetBall();
        }
    }
}

// Reset ball position
function resetBall() {
    ball.position.set(0, ballRadius, 0);
    
    // Random direction with reliable Z component
    ballDirection.x = (Math.random() - 0.5) * 0.8; // Less extreme x-direction
    ballDirection.z = (Math.random() > 0.5 ? 0.6 : -0.6); // Stronger z-direction
    
    // Normalize to keep consistent speed
    const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
    ballDirection.x /= length;
    ballDirection.z /= length;
    
    // Start with a moderate speed
    ballSpeed = 0.15;
}

// Update game state
function updateGame() {
    if (!gameStarted) return;
    
    // Precise collision detection with ray casting
    detectAndHandleCollisions();
    
    // Apply movement after collision handling
    ball.position.x += ballDirection.x * ballSpeed;
    ball.position.z += ballDirection.z * ballSpeed;
    
    // Ball rotation for visual effect
    ball.rotation.x += 0.02;
    ball.rotation.z += 0.02;
    
    // AI paddle movement
    const aiPaddleSpeed = 0.07;
    const targetX = ball.position.x * 0.8; // AI won't be perfect
    aiPaddle.position.x += (targetX - aiPaddle.position.x) * aiPaddleSpeed;
    
    // Keep AI paddle within table bounds
    aiPaddle.position.x = Math.max(Math.min(aiPaddle.position.x, tableWidth / 2 - paddleWidth / 2), -tableWidth / 2 + paddleWidth / 2);
    
    // Check scoring
    checkScoring();
}

// Collision detection with ray casting
function detectAndHandleCollisions() {
    // Create a ray from current ball position in direction of travel
    const rayOrigin = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);
    const rayDirection = new THREE.Vector3(ballDirection.x, 0, ballDirection.z).normalize();
    const ray = new THREE.Raycaster(rayOrigin, rayDirection, 0, ballSpeed * 1.5);
    
    // Potential collision objects
    const collisionObjects = [playerPaddle, aiPaddle];
    
    // Side wall collisions
    if (ball.position.x + ballDirection.x * ballSpeed > tableWidth / 2 - ballRadius || 
        ball.position.x + ballDirection.x * ballSpeed < -tableWidth / 2 + ballRadius) {
        ballDirection.x = -ballDirection.x;
    }
    
    // Check paddle collisions with ray
    const intersects = ray.intersectObjects(collisionObjects);
    
    if (intersects.length > 0 && intersects[0].distance < ballSpeed * 1.1) {
        const hitObject = intersects[0].object;
        
        // Different handling for player vs AI paddle
        if (hitObject === playerPaddle) {
            // Ensure bounce direction is away from player paddle
            ballDirection.z = -Math.abs(ballDirection.z);
            
            // Adjust x direction based on where the ball hit the paddle
            const hitPointX = intersects[0].point.x;
            const hitPosition = (hitPointX - playerPaddle.position.x) / (paddleWidth / 2);
            ballDirection.x = hitPosition * 0.8;
        } 
        else if (hitObject === aiPaddle) {
            // Ensure bounce direction is away from AI paddle
            ballDirection.z = Math.abs(ballDirection.z);
            
            // Adjust x direction based on where the ball hit the paddle
            const hitPointX = intersects[0].point.x;
            const hitPosition = (hitPointX - aiPaddle.position.x) / (paddleWidth / 2);
            ballDirection.x = hitPosition * 0.8;
        }
        
        // Normalize the direction vector
        const length = Math.sqrt(ballDirection.x * ballDirection.x + ballDirection.z * ballDirection.z);
        ballDirection.x /= length;
        ballDirection.z /= length;
        
        // Increase speed with each hit
        ballSpeed *= 1.05;
        
        // Reposition ball at hit point to prevent passing through
        if (hitObject === playerPaddle) {
            // Place ball just in front of the player paddle
            ball.position.z = playerPaddle.position.z - paddleDepth/2 - ballRadius - 0.01;
        } else {
            // Place ball just in front of the AI paddle
            ball.position.z = aiPaddle.position.z + paddleDepth/2 + ballRadius + 0.01;
        }
    }
}

// Check if ball is out of bounds for scoring
function checkScoring() {
    if (ball.position.z > tableHeight / 2 + 2) {
        // AI scores
        aiScore++;
        updateScoreDisplay();
        gameStarted = false;
    }
    
    if (ball.position.z < -tableHeight / 2 - 2) {
        // Player scores
        playerScore++;
        updateScoreDisplay();
        gameStarted = false;
    }
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('score-display').textContent = `Player: ${playerScore} | AI: ${aiScore}`;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    updateGame();
    renderer.render(scene, camera);
}

// Start the game
init();
