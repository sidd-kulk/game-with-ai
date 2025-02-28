document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pong');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
    const playerScoreElement = document.getElementById('player-score');
    const computerScoreElement = document.getElementById('computer-score');
    
    // Game objects
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        velocityX: 5,
        velocityY: 5,
        speed: 7,
        color: 'white'
    };

    const player = {
        x: 0, // left side
        y: (canvas.height - 100) / 2,
        width: 10,
        height: 100,
        score: 0,
        color: 'white'
    };

    const computer = {
        x: canvas.width - 10, // right side
        y: (canvas.height - 100) / 2,
        width: 10,
        height: 100,
        score: 0,
        color: 'white'
    };

    // Net
    const net = {
        x: (canvas.width - 2) / 2,
        y: 0,
        height: 10,
        width: 2,
        color: 'white'
    };

    // Draw net
    function drawNet() {
        for (let i = 0; i <= canvas.height; i += 15) {
            ctx.fillStyle = net.color;
            ctx.fillRect(net.x, i, net.width, net.height);
        }
    }

    // Draw rectangle
    function drawRect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    // Draw circle
    function drawArc(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    // Listening to keyboard
    let upArrowPressed = false;
    let downArrowPressed = false;

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            upArrowPressed = true;
        } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
            downArrowPressed = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        const key = event.key;
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            upArrowPressed = false;
        } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
            downArrowPressed = false;
        }
    });

    // Reset ball
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.velocityX = -ball.velocityX;
        ball.speed = 7;
    }

    // Collision detection
    function collision(b, p) {
        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;

        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width;

        return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
    }

    // Update: position, movement, score, etc
    function update() {
        // Move the player's paddle
        if (upArrowPressed && player.y > 0) {
            player.y -= 8;
        } else if (downArrowPressed && player.y < canvas.height - player.height) {
            player.y += 8;
        }

        // Simple AI for computer paddle
        // The computer's paddle follows the ball
        const computerLevel = 0.1;
        computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel;

        // Ball movement
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        // Ball collision with top and bottom boundaries
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.velocityY = -ball.velocityY;
        }

        // Check which player the ball is hitting
        let player = (ball.x + ball.radius < canvas.width/2) ? player : computer;

        if (collision(ball, player)) {
            // Where the ball hit the player
            let collidePoint = (ball.y - (player.y + player.height/2));
            
            // Normalization
            collidePoint = collidePoint / (player.height/2);
            
            // Calculate angle in radian
            let angleRad = (Math.PI/4) * collidePoint;
            
            // X direction of the ball when hit
            let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
            
            // Change velocity X and Y
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            
            // Every time the ball hits a paddle, increase speed
            ball.speed += 0.1;
        }

        // Update score
        if (ball.x - ball.radius < 0) {
            // Computer wins
            computer.score++;
            computerScoreElement.textContent = computer.score;
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            // Player wins
            player.score++;
            playerScoreElement.textContent = player.score;
            resetBall();
        }
    }

    // Render function
    function render() {
        // Clear the canvas
        drawRect(0, 0, canvas.width, canvas.height, "#000");
        
        // Draw the net
        drawNet();
        
        // Draw paddles
        drawRect(player.x, player.y, player.width, player.height, player.color);
        drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
        
        // Draw the ball
        drawArc(ball.x, ball.y, ball.radius, ball.color);
    }

    // Game loop
    let gameRunning = false;
    let gameLoop;

    function game() {
        update();
        render();
    }

    // Start game button
    startBtn.addEventListener('click', () => {
        if (!gameRunning) {
            gameRunning = true;
            startBtn.textContent = 'Restart Game';
            
            // Reset scores
            player.score = 0;
            computer.score = 0;
            playerScoreElement.textContent = '0';
            computerScoreElement.textContent = '0';
            
            // Reset ball
            resetBall();
            
            // Start game loop
            clearInterval(gameLoop);
            gameLoop = setInterval(game, 1000 / 60); // 60 FPS
        } else {
            // Reset the game
            clearInterval(gameLoop);
            gameRunning = false;
            startBtn.textContent = 'Start Game';
            
            // Reset scores
            player.score = 0;
            computer.score = 0;
            playerScoreElement.textContent = '0';
            computerScoreElement.textContent = '0';
            
            // Reset positions
            player.y = (canvas.height - player.height) / 2;
            computer.y = (canvas.height - computer.height) / 2;
            resetBall();
            
            // Render once to show the reset state
            render();
        }
    });

    // Initial render
    render();
});
