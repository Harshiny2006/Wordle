import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Game State
  const [grid, setGrid] = useState(Array.from({ length: 6 }, () => Array(5).fill('')));
  // NEW: A parallel 2D array to hold the color results from the server
  const [colors, setColors] = useState(Array.from({ length: 6 }, () => Array(5).fill('')));
  
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  // 2. Keyboard Event Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentRow >= 6) return;

      const key = e.key.toUpperCase();

      if (key === 'BACKSPACE') {
        if (currentCol > 0) {
          setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => [...row]);
            newGrid[currentRow][currentCol - 1] = '';
            return newGrid;
          });
          setCurrentCol((prev) => prev - 1);
        }
        return;
      }

      if (key === 'ENTER') {
        if (currentCol === 5) {
          const currentGuess = grid[currentRow].join('');
          
          // THE INTEGRATION: Using 'fetch' to send a POST request to our Node.js server
          fetch('http://localhost:5000/api/guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess: currentGuess })
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                alert(data.error);
                return;
              }

              // Update the colors array with the 'correct', 'present', or 'absent' labels from the server
              setColors((prevColors) => {
                const newColors = prevColors.map((row) => [...row]);
                newColors[currentRow] = data.result;
                return newColors;
              });

              // Check if they won!
              if (data.isCorrect) {
                setTimeout(() => alert('You Won! 🎉'), 300);
                setCurrentRow(6); // Ends the game
              } else {
                setCurrentRow((prev) => prev + 1);
                setCurrentCol(0);
              }
            })
            .catch((error) => console.error("Error communicating with server:", error));

        } else {
          alert('Word must be 5 letters!');
        }
        return;
      }

      if (/^[A-Z]$/.test(key)) {
        if (currentCol < 5) {
          setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => [...row]);
            newGrid[currentRow][currentCol] = key;
            return newGrid;
          });
          setCurrentCol((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRow, currentCol, grid]);

  return (
    <div className="app-container">
      <h1>Wordle</h1>
      <div className="wordle-grid">
        {grid.map((row, rowIndex) => (
          <div className="wordle-row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              /* Notice we inject the color state directly into the CSS class name here */
              <div className={`wordle-cell ${colors[rowIndex][colIndex]}`} key={colIndex}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;