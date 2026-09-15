# Full-Stack Wordle Clone

A polished, responsive, full-stack Wordle web application built with React, Node.js, and CSS3. Features custom state-driven gameplay logic, dynamic server-side word validation, interactive virtual keyboard support, and modern 3D flip animations.

---

## Features

- **Dynamic Word Generation:** Backend picks random 5-letter target words per session from a server-side dictionary.
- **Two-Pass Letter Validation:** Custom algorithm handling exact matches (green), misplaced letters (yellow), and absent characters (gray) without double-counting duplicate letters.
- **3D Card Flip Animations:** Smooth CSS3 keyframe animations triggering synchronized grid row reveals upon submission.
- **Responsive Layout:** Responsive typography and scaling using CSS `clamp()` and Viewport Height (`vh`) units to ensure full viewability across all screen sizes without scrolling.
- **Dual Input Methods:** Full support for both physical keyboard events and on-screen interactive touch keypads.

---

## Tech Stack

- **Frontend:** React (Vite), CSS3 (Flexbox, Keyframes, Clamp), JavaScript (ES6+)
- **Backend:** Node.js, Express.js, CORS
- **Version Control:** Git, GitHub

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/wordle-fullstack.git](https://github.com/YOUR_USERNAME/wordle-fullstack.git)
   cd wordle-fullstack
