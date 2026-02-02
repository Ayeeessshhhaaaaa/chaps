// Game State
let currentLevel = 0;
let gameState = {
    raceProgress: 0,
    carPosition: 50,
    speed: 0,
    puzzleConnections: 0,
    heartsCollected: 0,
    basketPosition: 50,
    glitchProgress: 0,
    noClickCount: 0
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Start Game
document.getElementById('start-btn').addEventListener('click', () => {
    showScreen('level1');
    startLevel1();
});

// ===== LEVEL 1: M4 MIDNIGHT DRIFT (ENHANCED) =====
let raceInterval;
let obstacleInterval;
let boostInterval;
let droneInterval;
let copInterval;
let teasingInterval;
let obstacles = [];

const teasingMessages = [
    "Careful, Chappi… fast cars turn me on 😏",
    "Eyes on the road, but your mind is on me… I can tell 👀",
    "That M4 isn’t the only thing running hot tonight 🔥",
    "Drive like you want me, baby 🏎️💋",
    "Smooth steering… just like your hands 😉",
    "Drift harder, Chappi… I like it risky 😈",
    "Vroom vroom… taking you straight to me 💕",
    "If you crash, I’ll kiss it better, my love 😘"
];

function startLevel1() {
    gameState.raceProgress = 0;
    gameState.carPosition = 50;
    gameState.speed = 0;
    obstacles = [];

    const car = document.getElementById('car');
    const progressBar = document.getElementById('race-progress');
    const speedDisplay = document.getElementById('speed');
    const obstaclesContainer = document.getElementById('obstacles');
    const teasingMessage = document.getElementById('teasing-message');

    // Clear any existing obstacles
    obstaclesContainer.innerHTML = '';
    teasingMessage.textContent = '';

    // Car controls
    document.addEventListener('keydown', handleCarMovement);

    // Show random teasing messages
    teasingInterval = setInterval(() => {
        const randomMessage = teasingMessages[Math.floor(Math.random() * teasingMessages.length)];
        teasingMessage.textContent = randomMessage;
        teasingMessage.style.opacity = '1';
        setTimeout(() => {
            teasingMessage.style.opacity = '0';
        }, 3000);
    }, 8000);

    // Start racing
    raceInterval = setInterval(() => {
        gameState.speed = Math.min(gameState.speed + 2, 180);
        gameState.raceProgress += 0.5;

        progressBar.style.width = gameState.raceProgress + '%';
        speedDisplay.textContent = Math.floor(gameState.speed);

        // Check win condition
        if (gameState.raceProgress >= 100) {
            clearInterval(raceInterval);
            clearInterval(obstacleInterval);
            clearInterval(boostInterval);
            clearInterval(droneInterval);
            clearInterval(copInterval);
            clearInterval(teasingInterval);
            document.removeEventListener('keydown', handleCarMovement);

            // Show checkpoint message
            const checkpointMsg = document.getElementById('checkpoint-message');
            checkpointMsg.textContent = "Checkpoint reached… but you're still driving straight into my heart, my baby. 💕";
            checkpointMsg.style.opacity = '1';

            setTimeout(() => {
                showScreen('level2');
                startLevel2();
            }, 3000);
        }
    }, 100);

    // Spawn regular obstacles
    obstacleInterval = setInterval(() => {
        spawnObstacle();
    }, 800);

    // Spawn heart speed boosts
    boostInterval = setInterval(() => {
        spawnSpeedBoost();
    }, 3000);

    // Spawn love drones
    droneInterval = setInterval(() => {
        spawnLoveDrone();
    }, 4000);

    // Spawn robot traffic cops
    copInterval = setInterval(() => {
        spawnRobotCop();
    }, 6000);
}

function handleCarMovement(e) {
    const car = document.getElementById('car');
    if (e.key === 'ArrowLeft') {
        gameState.carPosition = Math.max(20, gameState.carPosition - 5);
    } else if (e.key === 'ArrowRight') {
        gameState.carPosition = Math.min(80, gameState.carPosition + 5);
    }
    car.style.left = gameState.carPosition + '%';
}

function spawnObstacle() {
    const obstaclesContainer = document.getElementById('obstacles');
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';

    const randomPos = Math.random() * 80 + 10;
    obstacle.style.left = randomPos + '%';
    obstacle.style.top = '-100px';

    if (Math.random() > 0.5) {
        obstacle.style.background = 'url("bmw-obstacle.png") center/contain no-repeat';
        obstacle.style.width = '100px';
        obstacle.style.height = '60px';
    }

    obstaclesContainer.appendChild(obstacle);
    obstacles.push({ element: obstacle, position: randomPos });

    let top = -100;
    const moveObstacle = setInterval(() => {
        top += 5;
        obstacle.style.top = top + 'px';

        if (top > window.innerHeight * 0.6 && top < window.innerHeight * 0.7) {
            if (Math.abs(randomPos - gameState.carPosition) < 15) {
                gameState.speed = Math.max(0, gameState.speed - 30);
                obstacle.style.background = 'linear-gradient(135deg, #ff0000, #ff6600)';
            }
        }

        if (top > window.innerHeight) {
            clearInterval(moveObstacle);
            obstacle.remove();
        }
    }, 30);
}

function spawnSpeedBoost() {
    const obstaclesContainer = document.getElementById('obstacles');
    const boost = document.createElement('div');
    boost.className = 'speed-boost';
    boost.textContent = '💗';

    const randomPos = Math.random() * 80 + 10;
    boost.style.left = randomPos + '%';
    boost.style.top = '-50px';

    obstaclesContainer.appendChild(boost);

    let top = -50;
    const moveBoost = setInterval(() => {
        top += 4;
        boost.style.top = top + 'px';

        if (top > window.innerHeight * 0.6 && top < window.innerHeight * 0.7) {
            if (Math.abs(randomPos - gameState.carPosition) < 12) {
                gameState.speed = Math.min(220, gameState.speed + 40);
                document.getElementById('car').classList.add('boosted');
                setTimeout(() => {
                    document.getElementById('car').classList.remove('boosted');
                }, 2000);
                boost.remove();
                clearInterval(moveBoost);
            }
        }

        if (top > window.innerHeight) {
            clearInterval(moveBoost);
            boost.remove();
        }
    }, 30);
}

function spawnLoveDrone() {
    const obstaclesContainer = document.getElementById('obstacles');
    const drone = document.createElement('div');
    drone.className = 'love-drone';
    drone.textContent = '💕';

    const randomHeight = Math.random() * 300 + 100;
    drone.style.top = randomHeight + 'px';
    drone.style.left = '-50px';

    obstaclesContainer.appendChild(drone);

    let left = -50;
    let direction = 1;
    const moveDrone = setInterval(() => {
        left += 3;
        const wobble = Math.sin(left / 20) * 30;
        drone.style.left = left + 'px';
        drone.style.top = (randomHeight + wobble) + 'px';

        if (left > window.innerWidth) {
            clearInterval(moveDrone);
            drone.remove();
        }
    }, 30);
}

function spawnRobotCop() {
    const obstaclesContainer = document.getElementById('obstacles');
    const cop = document.createElement('div');
    cop.className = 'robot-cop';
    cop.innerHTML = '🤖<div class="cop-speech">Hey cutie! 😘</div>';

    const randomPos = Math.random() * 80 + 10;
    cop.style.left = randomPos + '%';
    cop.style.top = '-100px';

    obstaclesContainer.appendChild(cop);

    let top = -100;
    const moveCop = setInterval(() => {
        top += 3;
        cop.style.top = top + 'px';

        if (top > window.innerHeight) {
            clearInterval(moveCop);
            cop.remove();
        }
    }, 30);
}

// ===== LEVEL 2: TECH & ROBOT RIZZ LAB (ENHANCED) =====
let puzzleSequence = [];
let playerSequence = [];
const puzzleIcons = ['🔧', '⚡', '🔌', '💻', '🤖', '⚙️', '🔋', '💡', '🎮'];

const riddles = [
    { question: "What runs faster than your M4?", answer: "Ayesha falling for you 💗" },
    { question: "What's the password to my heart?", answer: "Shafwan nana" },
    { question: "What processes love faster than any CPU?", answer: "My heart when I see you" }
];

const errorMessages = [
    "Error 404: Too much rizz detected, try again, shafwan nana. 😅",
    "System overload: Cuteness level exceeds maximum 🥺",
    "Oops! Even tech geniuses make mistakes, my chungi 💙",
    "Wrong circuit, baby! But you're still right for me 💕"
];

function startLevel2() {
    gameState.puzzleConnections = 0;
    puzzleSequence = [];
    playerSequence = [];

    const circuitBoard = document.getElementById('circuit-board');
    const robotSpeech = document.getElementById('robot-speech');
    const connectionsCount = document.getElementById('connections-count');
    const riddleDisplay = document.getElementById('riddle-display');

    circuitBoard.innerHTML = '';

    // Show random riddle
    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    riddleDisplay.innerHTML = `<strong>Riddle:</strong> ${randomRiddle.question}<br><em>${randomRiddle.answer}</em>`;

    // Generate random sequence
    for (let i = 0; i < 5; i++) {
        puzzleSequence.push(Math.floor(Math.random() * 9));
    }

    // Create circuit nodes
    for (let i = 0; i < 9; i++) {
        const node = document.createElement('div');
        node.className = 'circuit-node';
        node.textContent = puzzleIcons[i];
        node.dataset.index = i;

        node.addEventListener('click', () => handleNodeClick(i, node));
        circuitBoard.appendChild(node);
    }

    setTimeout(() => {
        robotSpeech.textContent = `My love, click: ${puzzleIcons[puzzleSequence[0]]}`;
    }, 2000);
}

function handleNodeClick(index, node) {
    const robotSpeech = document.getElementById('robot-speech');
    const connectionsCount = document.getElementById('connections-count');

    if (index === puzzleSequence[playerSequence.length]) {
        node.classList.add('connected');
        playerSequence.push(index);
        gameState.puzzleConnections++;
        connectionsCount.textContent = gameState.puzzleConnections;

        if (playerSequence.length < puzzleSequence.length) {
            robotSpeech.textContent = `Yess Chappi! Now click: ${puzzleIcons[puzzleSequence[playerSequence.length]]}`;
        } else {
            robotSpeech.textContent = '💕 Perfect, my baby! Love circuit activated! 💕';
            setTimeout(() => {
                showScreen('level3');
                startLevel3();
            }, 2000);
        }
    } else {
        node.classList.add('active');
        setTimeout(() => node.classList.remove('active'), 300);
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        robotSpeech.textContent = randomError;
    }
}

// ===== LEVEL 3: HEART TOKEN HUSTLE (ENHANCED) =====
let heartInterval;
let kissInterval;
let miniRobotInterval;
let fallingHearts = [];

const flirtyPopups = [
    "+1 Heart… just like you stole mine, thief 😏",
    "Caught another one… you’re addicted to me, aren’t you? 😉",
    "Good hands, baby… I like that 💋",
    "Smooth catch… smooth like you in my DMs 😈",
    "That’s my man… heart collector 🔥",
    "You’re getting closer to me… feel it? 💕",
    "Don’t stop now, I’m watching 😏",
    "You’re so good at grabbing hearts… and other things 😈"
];


function startLevel3() {
    gameState.heartsCollected = 0;
    gameState.basketPosition = 50;
    fallingHearts = [];

    const basket = document.getElementById('basket');
    const heartsCount = document.getElementById('hearts-collected');
    const fallingHeartsContainer = document.getElementById('falling-hearts');
    const flyingKissesContainer = document.getElementById('flying-kisses');
    const miniRobotsContainer = document.getElementById('mini-robots');

    fallingHeartsContainer.innerHTML = '';
    flyingKissesContainer.innerHTML = '';
    miniRobotsContainer.innerHTML = '';
    heartsCount.textContent = '0';

    document.addEventListener('keydown', handleBasketMovement);

    heartInterval = setInterval(() => {
        spawnHeart();
    }, 600);

    kissInterval = setInterval(() => {
        spawnFlyingKiss();
    }, 2000);

    miniRobotInterval = setInterval(() => {
        spawnMiniRobot();
    }, 3000);
}

function handleBasketMovement(e) {
    const basket = document.getElementById('basket');
    if (e.key === 'ArrowLeft') {
        gameState.basketPosition = Math.max(10, gameState.basketPosition - 5);
    } else if (e.key === 'ArrowRight') {
        gameState.basketPosition = Math.min(90, gameState.basketPosition + 5);
    }
    basket.style.left = gameState.basketPosition + '%';
}

function spawnHeart() {
    const fallingHeartsContainer = document.getElementById('falling-hearts');
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = '💖';

    const randomPos = Math.random() * 85 + 5;
    heart.style.left = randomPos + '%';
    heart.style.top = '-50px';

    fallingHeartsContainer.appendChild(heart);

    let top = -50;
    const moveHeart = setInterval(() => {
        top += 4;
        heart.style.top = top + 'px';

        const gameContainer = document.getElementById('heart-game');
        const containerHeight = gameContainer.offsetHeight;

        if (top > containerHeight - 100 && top < containerHeight - 50) {
            if (Math.abs(randomPos - gameState.basketPosition) < 8) {
                gameState.heartsCollected++;
                document.getElementById('hearts-collected').textContent = gameState.heartsCollected;
                heart.remove();
                clearInterval(moveHeart);

                createSparkle(randomPos);
                showFlirtyPopup();

                if (gameState.heartsCollected >= 20) {
                    clearInterval(heartInterval);
                    clearInterval(kissInterval);
                    clearInterval(miniRobotInterval);
                    document.removeEventListener('keydown', handleBasketMovement);
                    setTimeout(() => {
                        showScreen('level4');
                        startLevel4();
                    }, 1000);
                }
            }
        }

        if (top > containerHeight) {
            clearInterval(moveHeart);
            heart.remove();
        }
    }, 30);
}

function spawnFlyingKiss() {
    const flyingKissesContainer = document.getElementById('flying-kisses');
    const kiss = document.createElement('div');
    kiss.className = 'flying-kiss';
    kiss.textContent = '💋';

    const randomHeight = Math.random() * 400 + 100;
    const direction = Math.random() > 0.5 ? 1 : -1;

    kiss.style.top = randomHeight + 'px';
    kiss.style.left = direction > 0 ? '-50px' : '100%';

    flyingKissesContainer.appendChild(kiss);

    let position = direction > 0 ? -50 : window.innerWidth;
    const moveKiss = setInterval(() => {
        position += direction * 5;
        kiss.style.left = position + 'px';

        if ((direction > 0 && position > window.innerWidth) || (direction < 0 && position < -50)) {
            clearInterval(moveKiss);
            kiss.remove();
        }
    }, 30);
}

function spawnMiniRobot() {
    const miniRobotsContainer = document.getElementById('mini-robots');
    const robot = document.createElement('div');
    robot.className = 'mini-robot';
    robot.textContent = '🤖💕';

    const randomPos = Math.random() * 80 + 10;
    robot.style.left = randomPos + '%';
    robot.style.top = '-50px';

    miniRobotsContainer.appendChild(robot);

    let top = -50;
    const moveRobot = setInterval(() => {
        top += 2;
        const targetX = gameState.basketPosition;
        const currentX = parseFloat(robot.style.left);
        const newX = currentX + (targetX - currentX) * 0.05;

        robot.style.top = top + 'px';
        robot.style.left = newX + '%';

        const gameContainer = document.getElementById('heart-game');
        const containerHeight = gameContainer.offsetHeight;

        if (top > containerHeight) {
            clearInterval(moveRobot);
            robot.remove();
        }
    }, 30);
}

function showFlirtyPopup() {
    const popup = document.getElementById('flirty-popup');
    const randomPopup = flirtyPopups[Math.floor(Math.random() * flirtyPopups.length)];

    popup.textContent = randomPopup;
    popup.style.opacity = '1';
    popup.style.transform = 'translateY(0)';

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(-20px)';
    }, 2000);
}

function createSparkle(position) {
    const gameContainer = document.getElementById('heart-game');
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = position + '%';
    sparkle.style.bottom = '80px';
    sparkle.style.fontSize = '2rem';
    sparkle.style.animation = 'pulse 0.5s ease-out';
    gameContainer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 500);
}

// ===== LEVEL 4: THE LOVE GLITCH HIGHWAY (NEW) =====
let glitchInterval;
let loveNoteInterval;
let aiGlitchInterval;

const loveNotes = [
    "Almost there, my love… keep driving to me 💕",
    "This highway leads straight to us, Chappi",
    "Every mile brings you closer to my heart 🏎️💗",
    "You're doing amazing, shafwan nana! 💫",
    "Can't wait to see you at the end, my baby 💕"
];

const aiGlitches = [
    "System.out.println('Chappi is cute');",
    "if (Shafwan) { Ayesha.love = true; }",
    "ERROR: Too handsome to process 😍",
    "while(true) { thinkAboutChappi(); }",
    "const love = Chappi + Ayesha; // = ∞"
];

function startLevel4() {
    gameState.glitchProgress = 0;
    gameState.carPosition = 50;

    const glitchCar = document.getElementById('glitch-car');
    const glitchSpeed = document.getElementById('glitch-speed');
    const loveNotesContainer = document.getElementById('love-notes');
    const aiGlitchesContainer = document.getElementById('ai-glitches');
    const heartTunnel = document.getElementById('heart-tunnel');

    loveNotesContainer.innerHTML = '';
    aiGlitchesContainer.innerHTML = '';
    heartTunnel.style.display = 'none';

    document.addEventListener('keydown', handleGlitchCarMovement);

    glitchInterval = setInterval(() => {
        gameState.glitchProgress += 1;
        glitchSpeed.textContent = Math.floor(150 + Math.random() * 50);

        if (gameState.glitchProgress >= 100) {
            clearInterval(glitchInterval);
            clearInterval(loveNoteInterval);
            clearInterval(aiGlitchInterval);
            document.removeEventListener('keydown', handleGlitchCarMovement);

            heartTunnel.style.display = 'flex';
            heartTunnel.innerHTML = '<div class="tunnel-text">Destination: Ayesha\'s Heart 💗</div>';

            setTimeout(() => {
                showScreen('level5');
                startLevel5();
            }, 3000);
        }
    }, 100);

    loveNoteInterval = setInterval(() => {
        spawnLoveNote();
    }, 3000);

    aiGlitchInterval = setInterval(() => {
        spawnAIGlitch();
    }, 2000);
}

function handleGlitchCarMovement(e) {
    const glitchCar = document.getElementById('glitch-car');
    if (e.key === 'ArrowLeft') {
        gameState.carPosition = Math.max(20, gameState.carPosition - 5);
    } else if (e.key === 'ArrowRight') {
        gameState.carPosition = Math.min(80, gameState.carPosition + 5);
    }
    glitchCar.style.left = gameState.carPosition + '%';
}

function spawnLoveNote() {
    const loveNotesContainer = document.getElementById('love-notes');
    const note = document.createElement('div');
    note.className = 'love-note';

    const randomNote = loveNotes[Math.floor(Math.random() * loveNotes.length)];
    note.textContent = randomNote;

    const randomPos = Math.random() * 70 + 15;
    note.style.left = randomPos + '%';
    note.style.top = '-100px';

    loveNotesContainer.appendChild(note);

    let top = -100;
    const moveNote = setInterval(() => {
        top += 3;
        note.style.top = top + 'px';

        if (top > window.innerHeight) {
            clearInterval(moveNote);
            note.remove();
        }
    }, 30);
}

function spawnAIGlitch() {
    const aiGlitchesContainer = document.getElementById('ai-glitches');
    const glitch = document.createElement('div');
    glitch.className = 'ai-glitch';

    const randomGlitch = aiGlitches[Math.floor(Math.random() * aiGlitches.length)];
    glitch.textContent = randomGlitch;

    const randomPos = Math.random() * 80 + 10;
    glitch.style.left = randomPos + '%';
    glitch.style.top = Math.random() * 400 + 'px';

    aiGlitchesContainer.appendChild(glitch);

    setTimeout(() => {
        glitch.remove();
    }, 3000);
}

// ===== LEVEL 5: FINAL BOSS - AYESHA'S HEART SYSTEM (UPGRADED) =====
const noMessages = [
    "Hmm… are you sure, Chappi? 🥺",
    "Try again, my love… I don’t accept that 😈",
    "Nice try, baby… but NO isn’t an option 💗",
    "Click YES, cutie… I’m watching you 😏",
    "Careful… you’re teasing me now 😈💕",
    "You like playing hard to get, don’t you? 😉",
    "I can be very persuasive, my love… click YES 🔥",
    "Last warning before I steal your heart completely 💋",
    "Okay fine… keep saying no… I’ll just make you say yes 😈",
    "You and me… Valentine… say it with me: YES 💕",
    "Every NO just makes me want you more… risky move, Chappi 😏",
    "You’re testing me… I like it… but still click YES 😈",
    "One more NO and I’m multiplying the YES button 💗"
];

function startLevel5() {
    gameState.noClickCount = 0;

    const yesBossBtn = document.getElementById('yes-boss-btn');
    const noBossBtn = document.getElementById('no-boss-btn');

    // Make YES pulse from the start
    yesBossBtn.classList.add('pulse');

    yesBossBtn.addEventListener('click', handleYesClick);
    noBossBtn.addEventListener('click', handleNoClick);
}

function handleNoClick() {
    gameState.noClickCount++;

    const noPopupOverlay = document.getElementById('no-popup-overlay');
    const heartRainContainer = document.getElementById('heart-rain-container');
    const yesBossBtn = document.getElementById('yes-boss-btn');
    const noBossBtn = document.getElementById('no-boss-btn');

    // Create flirty NO popup
    const popup = document.createElement('div');
    popup.className = 'no-popup';
    popup.textContent = noMessages[Math.min(gameState.noClickCount - 1, noMessages.length - 1)];

    noPopupOverlay.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1)';
    }, 10);

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.8)';
        setTimeout(() => popup.remove(), 300);
    }, 3000);

    // === MAKE "NO" BUTTON CRAZY ===

    // 1) Make NO button run away after 1 click
    const randomX = Math.random() * 60 + 20;
    const randomY = Math.random() * 60 + 20;
    noBossBtn.style.position = 'absolute';
    noBossBtn.style.left = randomX + '%';
    noBossBtn.style.top = randomY + '%';

    // 2) Shake YES harder each time he says NO
    yesBossBtn.classList.add('shake');
    setTimeout(() => yesBossBtn.classList.remove('shake'), 500);

    // 3) Make YES bigger over time
    yesBossBtn.style.transform = `scale(${1 + gameState.noClickCount * 0.1})`;

    // 4) After 3 NOs → duplicate YES button
    if (gameState.noClickCount === 3) {
        const cloneYes = yesBossBtn.cloneNode(true);
        cloneYes.id = "yes-boss-btn-clone";
        cloneYes.addEventListener('click', handleYesClick);
        yesBossBtn.parentElement.appendChild(cloneYes);
    }

    // 5) After 5 NOs → heart rain starts
    if (gameState.noClickCount >= 5) {
        startHeartRain();
    }

    // 6) After 7 NOs → NO button shrinks
    if (gameState.noClickCount >= 7) {
        noBossBtn.style.transform = 'scale(0.6)';
        noBossBtn.style.opacity = '0.6';
    }
}

function startHeartRain() {
    const heartRainContainer = document.getElementById('heart-rain-container');

    const rainInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'rain-heart';
        heart.textContent = ['💗', '💕', '💖', '💝'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 2 + 2) + 's';

        heartRainContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 4000);
    }, 100);
}

function handleYesClick() {
    showScreen('celebration');
    createEpicCelebration();
}

function createEpicCelebration() {
    const fireworksContainer = document.querySelector('.fireworks');
    const dancingRobotsContainer = document.getElementById('dancing-robots-container');
    const driftingCarsContainer = document.getElementById('drifting-cars-container');

    // Fireworks
    setInterval(() => {
        const firework = document.createElement('div');
        firework.textContent = ['🎆', '🎇', '✨', '💫', '⭐', '💖', '💕'][Math.floor(Math.random() * 7)];
        firework.style.position = 'absolute';
        firework.style.left = Math.random() * 100 + '%';
        firework.style.top = Math.random() * 100 + '%';
        firework.style.fontSize = Math.random() * 3 + 2 + 'rem';
        firework.style.animation = 'pulse 1s ease-out';
        fireworksContainer.appendChild(firework);

        setTimeout(() => firework.remove(), 1000);
    }, 200);

    // Dancing robots
    for (let i = 0; i < 5; i++) {
        const robot = document.createElement('div');
        robot.className = 'dancing-robot';
        robot.textContent = '🤖';
        robot.style.left = (i * 20 + 10) + '%';
        dancingRobotsContainer.appendChild(robot);
    }

    // Drifting cars
    setInterval(() => {
        const car = document.createElement('div');
        car.className = 'drifting-car';
        car.textContent = '🏎️';
        car.style.top = Math.random() * 80 + '%';
        driftingCarsContainer.appendChild(car);

        setTimeout(() => car.remove(), 3000);
    }, 1000);
}

// Replay
document.getElementById('replay-btn').addEventListener('click', () => {
    gameState = {
        raceProgress: 0,
        carPosition: 50,
        speed: 0,
        puzzleConnections: 0,
        heartsCollected: 0,
        basketPosition: 50,
        glitchProgress: 0,
        noClickCount: 0
    };

    clearInterval(raceInterval);
    clearInterval(obstacleInterval);
    clearInterval(boostInterval);
    clearInterval(droneInterval);
    clearInterval(copInterval);
    clearInterval(teasingInterval);
    clearInterval(heartInterval);
    clearInterval(kissInterval);
    clearInterval(miniRobotInterval);
    clearInterval(glitchInterval);
    clearInterval(loveNoteInterval);
    clearInterval(aiGlitchInterval);

    document.removeEventListener('keydown', handleCarMovement);
    document.removeEventListener('keydown', handleBasketMovement);
    document.removeEventListener('keydown', handleGlitchCarMovement);

    showScreen('start-screen');
});
