# Pong Game

A classic Pong game implemented with HTML, CSS, and JavaScript.

## Game Features

- Player vs Computer gameplay
- Score tracking
- Increasing difficulty (ball speed increases with each hit)
- Simple AI opponent

## How to Run the Game Locally

### Method 1: Directly Open in Browser

1. Clone this repository or download the files (`pong.html`, `styles.css`, and `pong.js`)
2. Open the `pong.html` file in your web browser

### Method 2: Using a Local Server

For a better experience, you can use a local development server:

#### Using Python:

If you have Python installed:

```bash
# For Python 3.x
python -m http.server

# For Python 2.x
python -m SimpleHTTPServer
```

Then visit `http://localhost:8000/pong.html` in your browser.

#### Using Node.js:

If you have Node.js installed:

1. Install `http-server` globally:
   ```bash
   npm install -g http-server
   ```

2. Run the server:
   ```bash
   http-server
   ```

3. Visit `http://localhost:8080/pong.html` in your browser.

## Game Controls

- Use the **W** key or **Up Arrow** to move your paddle up
- Use the **S** key or **Down Arrow** to move your paddle down
- Click the **Start Game** button to begin
- Click the **Restart Game** button to reset the game at any time

## Game Rules

- The ball will bounce off the top and bottom walls and paddles
- If the ball passes your paddle (left side), the computer scores a point
- If the ball passes the computer's paddle (right side), you score a point
- The ball speed increases slightly each time it hits a paddle, making the game progressively harder

Enjoy playing!
