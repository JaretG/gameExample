# gameExample
by Jaret Godinez 

README
This is a game example made with inspiration of a friend and their love of sharks. In this game you play as a shark that is trying to maneuver forwards while avoiding hitting some pillars. After pressing enter player uses keys UP DOWN RIGHT LEFT to pass moving pillar barriers that adds to a score that keeps a record of the best performance per session. 

Features
-5 layer moving background
-Sprite animation + display updates based on direction
-matching hitbox collisions 
-Progressive difficulty: (Speeds up after certain points)\
-Game States

Structure
├── index.html          # Main HTML + image tags
├── style.css           # Canvas styling
├── main.js             # Game class, loop, enemy spawning, difficulty
├── player.js           # Player movement, rotation, collision detection
├── playerStates.js     # Idle / Running state machine
├── enemies.js          # Pillar enemies + scoring logic
├── background.js       # Parallax layer system
├── input.js            # Keyboard input handler
├── UI.js               # Score, high score, and menu text
└── assets/             # Game images (player, background layers, pillars)

How to run
Open https://jaretg.github.io/gameExample/
or
1.Install the Live Server extension
2.Right-click index.html → Open with Live Server

Sprite from https://opengameart.org/content/shark-sprites-animated-4-directional 
Images ai generated using google