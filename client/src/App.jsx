import React, { useState, useEffect } from 'react';
import './App.css';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

function App() {
  const [grid, setGrid] = useState(Array.from({ length: 6 }, () => Array(5).fill('')));
  const [colors, setColors] = useState(Array.from({ length: 6 }, () => Array(5).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  // Reusable logic for both physical and virtual keyboards
  const processKey = (key) => {
    if (currentRow >= 6) return;

    if (key === 'BACKSPACE') {
      if (currentCol > 0) {
        setGrid(prev => {
          const newGrid = prev.map(row => [...row]);
          newGrid[currentRow][currentCol - 1] = '';
          return newGrid;
        });
        setCurrentCol(prev => prev - 1);
      }
      return;
    }

    if (key === 'ENTER') {
      if (currentCol === 5) {
        const currentGuess = grid[currentRow].join('');
        
        fetch('http://localhost:5000/api/guess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guess: currentGuess })
        })
          .then(res => res.json())
          .then(data => {
            if (data.error) return alert(data.error);

            setColors(prev => {
              const newColors = prev.map(row => [...row]);
              newColors[currentRow] = data.result;
              return newColors;
            });

            if (data.isCorrect) {
              setTimeout(() => alert('You Won! 🎉'), 300);
              setCurrentRow(6);
            } else {
              setCurrentRow(prev => prev + 1);
              setCurrentCol(0);
            }
          })
          .catch(err => console.error(err));
      } else {
        alert('Word must be 5 letters!');
      }
      return;
    }

    if (/^[A-Z]$/.test(key) && currentCol < 5) {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        newGrid[currentRow][currentCol] = key;
        return newGrid;
      });
      setCurrentCol(prev => prev + 1);
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => processKey(e.key.toUpperCase());
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
              <div className={`wordle-cell ${colors[rowIndex][colIndex]}`} key={colIndex}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* NEW: On-Screen Keyboard */}
      <div className="keyboard">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div className="keyboard-row" key={rowIndex}>
            {row.map((key) => (
              <button 
                key={key} 
                className={`key ${key === 'ENTER' || key === 'BACKSPACE' ? 'large-key' : ''}`}
                onClick={() => processKey(key)}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;