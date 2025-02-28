import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const [gameState, setGameState] = useState({
    player: { x: 5, y: 5 },
    enemies: [
      { id: 1, x: 10, y: 3 },
      { id: 2, x: 8, y: 8 }
    ],
    items: [
      { id: 1, x: 12, y: 5, type: 'health' },
      { id: 2, x: 3, y: 7, type: 'weapon' }
    ],
    score: 0
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      setGameState(prevState => {
        const newPlayer = { ...prevState.player };

        // Move player based on key press
        if (key === 'ArrowUp' || key === 'w') newPlayer.y = Math.max(0, prevState.player.y - 1);
        if (key === 'ArrowDown' || key === 's') newPlayer.y = Math.min(10, prevState.player.y + 1);
        if (key === 'ArrowLeft' || key === 'a') newPlayer.x = Math.max(0, prevState.player.x - 1);
        if (key === 'ArrowRight' || key === 'd') newPlayer.x = Math.min(15, prevState.player.x + 1);

        // Check for item collection
        const remainingItems = prevState.items.filter(item => {
          return item.x !== newPlayer.x || item.y !== newPlayer.y;
        });

        let newScore = prevState.score;
        if (remainingItems.length < prevState.items.length) {
          // Item collected
          newScore += 10;
        }

        return {
          ...prevState,
          player: newPlayer,
          items: remainingItems,
          score: newScore
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="game-container">
      <div className="game-info">
        <p>Score: {gameState.score}</p>
        <p>Use arrow keys or WASD to move</p>
      </div>
      <div className="game-board">
        {/* Render player */}
        <div 
          className="player" 
          style={{ 
            left: `${gameState.player.x * 30}px`, 
            top: `${gameState.player.y * 30}px` 
          }}
        ></div>
        
        {/* Render enemies */}
        {gameState.enemies.map(enemy => (
          <div 
            key={enemy.id}
            className="enemy"
            style={{ 
              left: `${enemy.x * 30}px`, 
              top: `${enemy.y * 30}px` 
            }}
          ></div>
        ))}
        
        {/* Render items */}
        {gameState.items.map(item => (
          <div 
            key={item.id}
            className={`item ${item.type}`}
            style={{ 
              left: `${item.x * 30}px`, 
              top: `${item.y * 30}px` 
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Game;
