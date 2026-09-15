// server/index.js (Upgraded Version)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- THE ENHANCEMENT: DYNAMIC WORDLIST ---
// In a real application, this would be a full dictionary of 2000+ words.
// For our upgrade, we use a curated list.
const WORDS_DICTIONARY = [
    "REACT", "WORLD", "APPLE", "BREAK", "DEBUG", "CLOUD", "ARRAY", 
    "INDEX", "SCOPE", "WHILE", "QUERY", "MOUSE", "SMILE", "BRAIN", 
    "TRAIN", "PIXEL", "LOGIN", "STACK", "QUEUE"
];

// This variable will hold the word for the CURRENT game session.
let currentSecretWord = "";

// Function to select a random word
const pickNewSecretWord = () => {
    const randomIndex = Math.floor(Math.random() * WORDS_DICTIONARY.length);
    currentSecretWord = WORDS_DICTIONARY[randomIndex];
    
    // !!! DEV LOG !!! 
    // Interviewers look for proper logging. We are logging the secret 
    // word now so YOU can test quickly in development! 
    console.log(`[DEV ONLY] New Secret Word Selected: ${currentSecretWord}`);
}

// Immediately pick the first word when the server starts up
pickNewSecretWord();


// Validate Wordle Guess API Endpoint
app.post('/api/guess', (req, res) => {
    const { guess } = req.body;

    if (!guess || guess.length !== 5) {
        return res.status(400).json({ error: "Guess must be exactly 5 letters." });
    }

    const formattedGuess = guess.toUpperCase();
    
    // --- Now using the dynamic currentSecretWord variable ---
    const target = currentSecretWord; 
    
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


// Endpoint to handle the game over scenario (starts a new game)
app.get('/api/reset', (req, res) => {
    pickNewSecretWord();
    res.json({ message: "Game reset. A new word has been selected." });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});