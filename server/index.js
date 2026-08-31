const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Target secret word for MVP (all uppercase)
const SECRET_WORD = "REACT";

// Validate Wordle Guess API Endpoint
app.post('/api/guess', (req, res) => {
    const { guess } = req.body;

    if (!guess || guess.length !== 5) {
        return res.status(400).json({ error: "Guess must be exactly 5 letters." });
    }

    const formattedGuess = guess.toUpperCase();
    const target = SECRET_WORD;
    const result = new Array(5).fill('absent'); // 'absent' = gray
    const targetLetterCounts = {};

    // Step 1: Count target letter frequencies
    for (let char of target) {
        targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
    }

    // Step 2: First pass for EXACT matches (green)
    for (let i = 0; i < 5; i++) {
        if (formattedGuess[i] === target[i]) {
            result[i] = 'correct';
            targetLetterCounts[formattedGuess[i]] -= 1;
        }
    }

    // Step 3: Second pass for WRONG POSITION matches (yellow)
    for (let i = 0; i < 5; i++) {
        if (result[i] !== 'correct') {
            const char = formattedGuess[i];
            if (targetLetterCounts[char] > 0) {
                result[i] = 'present';
                targetLetterCounts[char] -= 1;
            }
        }
    }

    const isCorrect = formattedGuess === target;
    res.json({ guess: formattedGuess, result, isCorrect });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});