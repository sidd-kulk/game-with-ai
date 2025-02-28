# 3D Pong Game with Three.js

This is a simple 3D Pong game created with Three.js.

## Game Features

- 3D graphics using Three.js
- Player vs AI gameplay
- Score tracking
- Responsive design
- Physics-based ball movement
- Increasing difficulty as the game progresses

## Controls

- Move your paddle with the mouse or touch
- Press SPACE to start or restart the game

## How to Run Locally

### Option 1: Using a simple HTTP server

If you have Python installed:

```bash
# For Python 3.x
python -m http.server

# For Python 2.x
python -m SimpleHTTPServer
```

Then open your browser and go to: http://localhost:8000

### Option 2: Using Node.js

If you prefer using Node.js:

1. Install the `http-server` package:

```bash
npm install -g http-server
```

2. Run the server:

```bash
http-server
```

3. Open your browser and go to: http://localhost:8080

### Option 3: Using VS Code

If you use Visual Studio Code, you can use the "Live Server" extension:

1. Install the "Live Server" extension
2. Right-click on `index.html` and select "Open with Live Server"

## Game Structure

- `index.html`: Main HTML file with game layout
- `js/game.js`: Game logic using Three.js

## How to Play

1. Move your paddle to hit the ball
2. Don't let the ball pass your paddle
3. Try to get the ball past the AI's paddle to score points

Enjoy the game!
