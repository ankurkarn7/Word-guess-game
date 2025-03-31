// Global Variables
let wordLength = null,
    maxTries = null,
    wordMode = null,
    word = null,
    guessedWord = [],
    triesLeft = 0,
    wrongLetters = [];

// Sample word lists (expand these arrays as needed)
const words = {
    4: ["code", "game", "love", "play", "road", "bird", "jump", "free", "lake", "moon", "blue", "tree", "wind", "star", "fire", "wave", "cloud", "stone", "light", "dark", "book", "fish", "sand", "pink", "ring", "gold", "note", "king", "boss", "duck", "goat", "lamp", "wolf", "card", "seal", "mask", "hero", "echo", "pear", "frog", "jazz", "beam", "wish", "mint", "gate", "flap", "rust", "palm", "leaf", "cake", "bold", "dawn", "wood", "root", "clay", "shade", "mood", "flow", "tune", "luck", "coin", "rope", "beam", "flute", "glow", "chop", "brim", "dash", "swan", "mile", "pike", "torn", "dart", "poem", "silk", "leaf", "haze", "fern", "gale", "veil", "maze", "fame", "grip", "band", "solo", "vast", "void", "limb", "doom", "brim", "film", "moth", "pond", "dust", "cave", "wisp", "pine", "slip", "blur"],
    5: ["apple", "table", "chair", "mouse", "grape", "beach", "sword", "ruler", "cloud", "crisp", "swing", "trail", "giant", "frown", "smile", "joker", "lucky", "bloom", "zebra", "melon", "wrist", "ghost", "sight", "pride", "jolly", "truth", "power", "heart", "chess", "novel", "watch", "brave", "flame", "gloom", "swift", "lemon", "dream", "crush", "frost", "spine", "crane", "peace", "fable", "sheep", "quest", "glide", "skull", "stark", "brisk", "spice", "storm", "drift", "spear", "feast", "flick", "spray", "carve", "flock", "wheat", "curse", "swoop", "blast", "glaze", "stomp", "twirl", "ranch", "haste", "shove", "scent", "grasp", "shady", "creep", "plume", "torch", "vivid", "flood", "frown", "lunar", "quirk", "spool", "chime", "chill", "swoop", "jumpy", "jumbo", "prism", "scout", "chirp", "blend", "sworn", "bison", "quilt", "clash", "spike", "twist", "brisk", "shrub"],
    6: ["laptop", "guitar", "puzzle", "rocket", "banter", "goblin", "socket", "beacon", "stride", "flinch", "throne", "legend", "squash", "sprint", "nectar", "temple", "subtle", "gadget", "candle", "marble", "orange", "pickle", "desert", "forest", "butter", "shadow", "velvet", "silver", "piston", "planet", "hammer", "sphinx", "bricks", "fierce", "frozen", "matrix", "jumble", "whisper", "decent", "bright", "twenty", "vortex", "glitch", "launch", "emblem", "slogan", "cuddle", "narrow", "branch", "timber", "cradle", "rescue", "glider", "banner", "sniper", "savage", "anoint", "castle", "driven", "cozyup", "tremor", "pepper", "jester", "bravem", "wizard", "summit", "flames", "mystic", "rocket", "jumble", "scroll", "whimsy", "thrive", "zodiac", "paddle", "fathom", "hurdle", "whacky", "blazer", "quaint", "mortal", "weasel", "walnut", "knight", "boomer", "garlic", "trifle", "morale", "anthem", "shrimp", "cutlet", "tangle", "unicorn"]
};

// QWERTY Keyboard Layout
const keyboardLayout = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm"
];

// --- Option Selection Functions ---
function setWordLength(length) {
  wordLength = length;
  updateSelection("word-length-btn", length);
  checkStartCondition();
}

function setTries(tries) {
  maxTries = tries;
  triesLeft = tries;
  updateSelection("tries-btn", tries);
  document.getElementById("triesLeft").textContent = `Tries Left: ${triesLeft}`;
  checkStartCondition();
}

function setWordMode(mode) {
  wordMode = mode;
  updateSelection("mode-btn", mode);
  // If custom mode, display the input field for the word
  if (mode === "custom") {
    document.getElementById("customWordDiv").style.display = "block";
  } else {
    document.getElementById("customWordDiv").style.display = "none";
  }
  checkStartCondition();
}

// Update the appearance of option buttons.
function updateSelection(className, selectedValue) {
  const buttons = document.querySelectorAll(`.${className}`);
  buttons.forEach(btn => {
    if (btn.getAttribute("data-value") == selectedValue) {
      btn.classList.add("selected");
      btn.classList.remove("faded");
    } else {
      btn.classList.remove("selected");
      btn.classList.add("faded");
    }
  });
}

// Enable the Start Game button if all options are chosen.
function checkStartCondition() {
  const startBtn = document.getElementById("startBtn");
  if (wordLength && maxTries && wordMode) {
    startBtn.disabled = false;
    startBtn.classList.add("enabled");
    startBtn.style.cursor = "pointer";
  } else {
    startBtn.disabled = true;
    startBtn.classList.remove("enabled");
    startBtn.style.cursor = "not-allowed";
  }
}

// --- Game Functions ---
function startGame() {
  // Hide the setup screen, show the game screen.
  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";
  
  // Get the word based on mode.
  if (wordMode === "random") {
    const list = words[wordLength];
    word = list[Math.floor(Math.random() * list.length)];
  } else if (wordMode === "custom") {
    word = document.getElementById("manualWordInput").value.toLowerCase().trim();
    if (word.length !== parseInt(wordLength)) {
      alert(`Word must be exactly ${wordLength} letters long.`);
      document.getElementById("setup").style.display = "block";
      document.getElementById("game").style.display = "none";
      return;
    }
  }
  
  // Initialize game state.
  guessedWord = Array(wordLength).fill("_");
  wrongLetters = [];
  triesLeft = maxTries;
  
  // Update game display.
  document.getElementById("wordDisplay").textContent = guessedWord.join(" ");
  document.getElementById("wrongLetters").textContent = "Wrong Letters:";
  document.getElementById("triesLeft").textContent = `Tries Left: ${triesLeft}`;
  document.getElementById("resultMessage").textContent = "";
  document.getElementById("playAgainBtn").style.display = "none";
  
  // Generate the QWERTY keyboard.
  generateKeyboard();
}

function generateKeyboard() {
  const keyboardDiv = document.getElementById("keyboard");
  keyboardDiv.innerHTML = "";
  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    row.split("").forEach(letter => {
      const btn = document.createElement("button");
      btn.textContent = letter.toUpperCase();
      btn.onclick = function() {
        guessLetter(letter, btn);
      };
      rowDiv.appendChild(btn);
    });
    keyboardDiv.appendChild(rowDiv);
  });
}

function guessLetter(letter, btn) {
  // Do nothing if game is over.
  if (triesLeft <= 0 || guessedWord.join("") === word) return;
  btn.disabled = true;
  
  if (word.includes(letter)) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        guessedWord[i] = letter;
      }
    }
    document.getElementById("wordDisplay").textContent = guessedWord.join(" ");
    if (!guessedWord.includes("_")) {
      endGame(true);
    }
  } else {
    wrongLetters.push(letter);
    triesLeft--;
    document.getElementById("wrongLetters").textContent = "Wrong Letters: " + wrongLetters.join(", ");
    document.getElementById("triesLeft").textContent = `Tries Left: ${triesLeft}`;
    if (triesLeft === 0) {
      endGame(false);
    }
  }
}

function endGame(win) {
  const resultMsg = document.getElementById("resultMessage");
  if (win) {
    resultMsg.innerHTML = `🎉 Congratulations! You guessed the word: <strong>${word.toUpperCase()}</strong>`;
  } else {
    resultMsg.innerHTML = `😞 You lost! The word was: <strong>${word.toUpperCase()}</strong>`;
  }
  // Disable keyboard buttons.
  document.querySelectorAll("#keyboard button").forEach(btn => btn.disabled = true);
  document.getElementById("playAgainBtn").style.display = "block";
}

function restartGame() {
  // Return to the setup screen while keeping previous selections if desired.
  document.getElementById("setup").style.display = "block";
  document.getElementById("game").style.display = "none";
}
