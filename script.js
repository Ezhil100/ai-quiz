
// ===== QUIZ DATA =====
// Enhanced with topics and difficulty metadata for AI-driven personalization
const quizQuestions = [
    {
        id: 1,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        difficulty: 'easy',
        topic: 'astronomy',
        type: 'multiple-choice',
        explanation: "Mars appears red due to iron oxide (rust) on its surface.",
        points: 100
    },
    {
        id: 2,
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        correct: 2,
        difficulty: 'medium',
        topic: 'geography',
        type: 'multiple-choice',
        explanation: "Tokyo has been Japan's capital since 1868, replacing Kyoto.",
        points: 120
    },
    {
        id: 3,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2,
        difficulty: 'easy',
        topic: 'art',
        type: 'multiple-choice',
        explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519.",
        points: 100
    },
    {
        id: 4,
        question: "Calculate: What is 15% of 80?",
        options: ["10", "12", "14", "16"],
        correct: 1,
        difficulty: 'medium',
        topic: 'mathematics',
        type: 'math-calculation',
        explanation: "15% of 80 = 0.15 × 80 = 12",
        points: 150
    },
    {
        id: 5,
        question: "Which of these are renewable energy sources? (Select all correct)",
        options: ["Solar", "Coal", "Wind", "Natural Gas"],
        correct: [0, 2],
        difficulty: 'hard',
        topic: 'science',
        type: 'multiple-answer',
        explanation: "Solar and Wind are renewable. Coal and Natural Gas are fossil fuels.",
        points: 200
    }
];

// ===== POWER-UPS SYSTEM =====
const POWERUPS = {
    HINT: { name: '💡 Hint', cost: 50, description: 'AI reveals strategy' },
    FIFTY_FIFTY: { name: '➗ 50/50', cost: 75, description: 'Remove 2 wrong answers' },
    TIME_FREEZE: { name: '⏰ Time Freeze', cost: 100, description: 'Add 10 seconds' },
    DOUBLE_POINTS: { name: '✖️2 Points', cost: 150, description: 'Next answer worth 2x' }
};

let activePowerups = {
    doublePoints: false,
    fiftyFiftyUsed: false
};

// ===== USER PROFILE & ANALYTICS =====
let userProfile = {
    totalQuizzes: 0,
    totalQuestions: 0,
    overallAccuracy: 0,
    topicStrengths: {},
    topicWeaknesses: {},
    badges: [],
    dailyStreak: 0,
    lastPlayedDate: null,
    avgResponseTime: 0,
    bestStreak: 0,
    totalScore: 0,
    powerupsUsed: 0,
    teamModeWins: 0
};

// Load saved profile
try {
    const saved = localStorage.getItem('quizUserProfile');
    if (saved) userProfile = { ...userProfile, ...JSON.parse(saved) };
} catch (e) {
    console.log('No saved profile found');
}

// Helper function to save profile
function saveProfile() {
    try {
        localStorage.setItem('quizUserProfile', JSON.stringify(userProfile));
    } catch (e) {
        console.error('Failed to save profile:', e);
    }
}

// ===== ADAPTIVE DIFFICULTY CONFIG =====
const TOTAL_QUESTIONS = 5;
const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];
const DIFFICULTY_LABELS = { easy: 'EASY', medium: 'MEDIUM', hard: 'HARD' };
const DIFFICULTY_TIME = { easy: 20, medium: 15, hard: 12 };
const DIFFICULTY_SCORE_MULT = { easy: 1.0, medium: 1.2, hard: 1.5 };

let currentTier = (localStorage.getItem('startingTier') || 'medium');
let selectedQuestions = [];
let usedQuestionIds = new Set();
let questionPool = { easy: [], medium: [], hard: [] };
let currentMaxTime = DIFFICULTY_TIME[currentTier];
let sessionTopicPerformance = {};
let earnedBadgesThisSession = [];

// ===== GAME STATE =====
let currentQuestion = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let timeLeft = 15;
let timerInterval = null;
let questionStartTime = 0;   
let responseTimes = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let hesitationCount = 0;

// ===== DOM ELEMENTS =====
const welcomeScreen = document.getElementById('welcomeScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const viewDashboardBtn = document.getElementById('viewDashboardBtn');
const closeDashboardBtn = document.getElementById('closeDashboardBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');

const scoreDisplay = document.getElementById('scoreDisplay');
const streakDisplay = document.getElementById('streakCount');
const streakFire = document.getElementById('streakFire');
const timerDisplay = document.getElementById('timerDisplay');
const timerNumber = document.getElementById('timerNumber');
const timerCircle = document.getElementById('timerCircle');
const difficultyDisplay = document.getElementById('difficultyDisplay');

const currentQDisplay = document.getElementById('currentQ');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');

const questionCard = document.getElementById('questionCard');
const questionNum = document.getElementById('questionNum');
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');

const aiToast = document.getElementById('aiToast');
const aiMessage = document.getElementById('aiMessage');
const aiTracker = document.getElementById('aiTracker');
const trackerText = document.getElementById('trackerText');

const accuracyStat = document.getElementById('accuracyStat');
const finalScore = document.getElementById('finalScore');
const avgSpeed = document.getElementById('avgSpeed');
const aiSummary = document.getElementById('aiSummary');

// Leaderboard & Team Mode Elements
const leaderboardScreen = document.getElementById('leaderboardScreen');
const teamSetupScreen = document.getElementById('teamSetupScreen');
const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
const teamModeBtn = document.getElementById('teamModeBtn');
const cancelTeamModeBtn = document.getElementById('cancelTeamModeBtn');
const startTeamQuizBtn = document.getElementById('startTeamQuizBtn');
const leaderboardContent = document.getElementById('leaderboardContent');

// Power-up Elements
const powerupsBar = document.getElementById('powerupsBar');
const powerupPointsDisplay = document.getElementById('powerupPoints');

// AI Explanation Panel
let aiExplanationPanel = null;

// ===== GROQ AI CONFIGURATION =====


// ===== EVENT LISTENERS =====
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', resetQuiz);
viewDashboardBtn.addEventListener('click', openDashboard);
closeDashboardBtn.addEventListener('click', closeDashboard);
backToMenuBtn.addEventListener('click', backToMenu);
viewLeaderboardBtn.addEventListener('click', openLeaderboard);
closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
teamModeBtn.addEventListener('click', openTeamSetup);
cancelTeamModeBtn.addEventListener('click', closeTeamSetup);
startTeamQuizBtn.addEventListener('click', startTeamQuiz);

// Power-up button listeners
document.querySelectorAll('.powerup-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const powerupType = btn.dataset.powerup;
        usePowerup(powerupType);
    });
});

// ===== SOUND EFFECTS (Web Audio API) =====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    switch(type) {
        case 'correct':
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
            break;
        case 'wrong':
            oscillator.frequency.value = 200;
            oscillator.type = 'sawtooth';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
            break;
        case 'click':
            oscillator.frequency.value = 600;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05);
            break;
    }
}

// ===== ANIMATIONS =====
function animateScreenTransition(hideScreen, showScreen) {
    gsap.to(hideScreen, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            hideScreen.classList.remove('active');
            showScreen.classList.add('active');
            gsap.fromTo(showScreen, 
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
        }
    });
}

function animateQuestionTransition() {
    // Exit animation for current question
    gsap.to(questionCard, {
        y: -30,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            loadQuestion();
            // Enter animation for new question
            gsap.fromTo(questionCard,
                { y: 30, opacity: 0, filter: 'blur(10px)', scale: 0.95 },
                { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.5, ease: 'power2.out' }
            );
        }
    });
}

function animateOptionHover(option) {
    gsap.to(option, {
        y: -4,
        duration: 0.2,
        ease: 'power2.out'
    });
}

function animateOptionLeave(option) {
    gsap.to(option, {
        y: 0,
        duration: 0.2,
        ease: 'power2.out'
    });
}

function showAIToast(message, duration = 2500) {
    aiMessage.textContent = message;
    aiToast.classList.add('show');
    
    // Add visual indicator that AI is "watching"
    if (message.includes('speed') || message.includes('fast')) {
        aiToast.style.borderColor = 'rgba(0, 255, 255, 0.6)';
    } else if (message.includes('streak') || message.includes('straight')) {
        aiToast.style.borderColor = 'rgba(255, 106, 0, 0.6)';
    } else if (message.includes('lost') || message.includes('wrong')) {
        aiToast.style.borderColor = 'rgba(255, 51, 102, 0.5)';
    } else {
        aiToast.style.borderColor = 'rgba(157, 78, 221, 0.3)';
    }
    
    // Cancel any existing hide animation
    gsap.killTweensOf(aiToast);
    
    gsap.fromTo(aiToast,
        { scale: 0.8, opacity: 0 },
        { 
            scale: 1, 
            opacity: 1, 
            duration: 0.5, 
            ease: 'back.out(2)',
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(aiToast, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'back.in(1.7)',
                        onComplete: () => aiToast.classList.remove('show')
                    });
                }, duration);
            }
        }
    );
}

function celebrateCorrectAnswer() {
    // Confetti burst
    confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffff', '#9d4edd', '#ccff00']
    });
    
    playSound('correct');
}

function vibrateWrongAnswer(option) {
    // Vibration effect (if supported)
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
    }
    
    playSound('wrong');
}

// ===== TIMER FUNCTIONS =====
function startTimer() {
    currentMaxTime = DIFFICULTY_TIME[currentTier] || 15;
    timeLeft = currentMaxTime;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // Check for hesitation (if time drops below 25% and they haven't answered)
        if (timeLeft === Math.max(3, Math.floor(currentMaxTime * 0.25))) {
            hesitationCount++;
            timerCircle.classList.add('warning');
            // AI pushes for action with specific time context
            const secondsLeft = timeLeft;
            const urgencyMsg = secondsLeft <= 3 ? "Time's almost gone pick one" :
                              secondsLeft <= 5 ? "Stop overthinking trust yourself" :
                              "Your first instinct is usually right";
            showAIToast(urgencyMsg, 1500);
        }
        
        if (timeLeft <= 3) {
            timerCircle.classList.add('danger');
            timerCircle.classList.remove('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `${timeLeft}s`;
    timerNumber.textContent = timeLeft;
    
    // Circular progress
    const circumference = 283; // 2 * PI * 45
    const progress = (timeLeft / currentMaxTime) * circumference;
    timerCircle.style.strokeDashoffset = circumference - progress;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerCircle.classList.remove('warning', 'danger');
}

function handleTimeout() {
    wrongAnswers++;
    streak = 0;
    updateStreak();
    
    // AI coaches through timeout
    const timeoutMessages = [
        "Time's up! Trust your instincts faster",
        "Clock beat you! Speed is your next mission",
        "Too slow! Your brain knows the answer",
        "Timeout! Quick decisions win games"
    ];
    showAIToast(timeoutMessages[Math.floor(Math.random() * timeoutMessages.length)], 2000);
    
    adjustDifficultyOnAnswer(false, currentMaxTime);
    
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

// ===== QUIZ LOGIC =====
function startQuiz() {
    playSound('click');
    animateScreenTransition(welcomeScreen, quizScreen);
    resetGameState();
    initializeQuestionPool();
    ensureNextQuestionPrepared();
    
    // AI Welcome - immediate engagement
    setTimeout(() => {
        const welcomes = [
            "Alright, let's see what you've got",
            "I'll be watching. Make it interesting",
            "Show me your style. Speed or precision?",
            "Five questions. Make every one count"
        ];
        showAIToast(welcomes[Math.floor(Math.random() * welcomes.length)], 3000);
    }, 800);
    
    animateQuestionTransition();
}

function resetGameState() {
    currentQuestion = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    responseTimes = [];
    hesitationCount = 0;
    selectedQuestions = [];
    usedQuestionIds = new Set();
    sessionTopicPerformance = {};
    earnedBadgesThisSession = [];
    
    // Reset power-ups
    activePowerups = {
        doublePoints: false,
        fiftyFiftyUsed: false,
        teamMode: activePowerups.teamMode || false,
        teamName: activePowerups.teamName || null,
        playerName: activePowerups.playerName || null,
        teamSize: activePowerups.teamSize || 2,
        teamScore: activePowerups.teamScore || 0
    };
    
    // Reset powerup points display
    if (powerupPointsDisplay) {
        powerupPointsDisplay.textContent = '200';
    }
    
    // Update daily streak
    const today = new Date().toDateString();
    if (userProfile.lastPlayedDate === today) {
        // Already played today
    } else {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (userProfile.lastPlayedDate === yesterday) {
            userProfile.dailyStreak++;
        } else {
            userProfile.dailyStreak = 1;
        }
        userProfile.lastPlayedDate = today;
    }
    
    updateScore();
    updateStreak();
    updateProgress();
    updateDifficultyDisplay();
}

function initializeQuestionPool() {
    questionPool = { easy: [], medium: [], hard: [] };
    quizQuestions.forEach(q => {
        questionPool[q.difficulty].push(q);
    });
}

function updateDifficultyDisplay() {
    if (difficultyDisplay) {
        difficultyDisplay.textContent = DIFFICULTY_LABELS[currentTier] || 'MEDIUM';
    }
}

function pickQuestionForTier(tier) {
    const pool = questionPool[tier].filter(q => !usedQuestionIds.has(q.id));
    if (pool.length === 0) return null;
    
    // PERSONALIZED QUESTION SELECTION: Prioritize weak topics
    const weakTopics = Object.keys(userProfile.topicWeaknesses || {})
        .filter(t => userProfile.topicWeaknesses[t] < 0.6); // Less than 60% accuracy
    
    const weakTopicQuestions = pool.filter(q => weakTopics.includes(q.topic));
    
    if (weakTopicQuestions.length > 0 && Math.random() > 0.3) {
        // 70% chance to pick from weak topics
        return weakTopicQuestions[Math.floor(Math.random() * weakTopicQuestions.length)];
    }
    
    return pool[Math.floor(Math.random() * pool.length)];
}

function ensureNextQuestionPrepared() {
    if (selectedQuestions.length >= TOTAL_QUESTIONS) return;
    // Try current tier, then adjacent tiers
    let q = pickQuestionForTier(currentTier);
    if (!q) {
        const currentIdx = DIFFICULTY_ORDER.indexOf(currentTier);
        const candidates = [currentIdx - 1, currentIdx + 1]
            .filter(i => i >= 0 && i < DIFFICULTY_ORDER.length)
            .map(i => DIFFICULTY_ORDER[i]);
        for (const t of candidates) {
            q = pickQuestionForTier(t);
            if (q) break;
        }
    }
    // Fallback: any remaining question
    if (!q) {
        const remaining = quizQuestions.filter(x => !usedQuestionIds.has(x.id));
        if (remaining.length > 0) q = remaining[Math.floor(Math.random() * remaining.length)];
    }
    if (q) {
        usedQuestionIds.add(q.id);
        selectedQuestions.push(q);
    }
}

function loadQuestion() {
    const q = selectedQuestions[currentQuestion];
    questionNum.textContent = currentQuestion + 1;
    questionText.textContent = q.question;
    
    // Update AI tracker
    if (aiTracker) {
        aiTracker.classList.add('active');
        const trackerMsgs = [
            `Watching Q${currentQuestion + 1}...`,
            `Tracking your moves...`,
            `Observing patterns...`,
            `Reading your style...`
        ];
        if (trackerText) trackerText.textContent = trackerMsgs[currentQuestion % trackerMsgs.length];
    }
    
    // Clear and rebuild options
    optionsGrid.innerHTML = '';
    
    // For multi-answer questions, track selected options
    if (q.type === 'multiple-answer') {
        const selectedIndices = new Set();
        
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn multi-select';
            btn.textContent = option;
            btn.dataset.index = index;
            
            btn.addEventListener('click', () => {
                if (btn.classList.contains('selected-multi')) {
                    btn.classList.remove('selected-multi');
                    selectedIndices.delete(index);
                } else {
                    btn.classList.add('selected-multi');
                    selectedIndices.add(index);
                }
            });
            
            optionsGrid.appendChild(btn);
        });
        
        // Add submit button for multi-answer
        const submitBtn = document.createElement('button');
        submitBtn.className = 'submit-multi-btn';
        submitBtn.textContent = '✓ Submit Answer';
        submitBtn.addEventListener('click', () => {
            handleMultiAnswer(Array.from(selectedIndices), submitBtn);
        });
        optionsGrid.appendChild(submitBtn);
        
    } else {
        // Single answer questions
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.dataset.index = index;
            
            // Hover effects
            btn.addEventListener('mouseenter', () => {
                animateOptionHover(btn);
                playSound('click');
            });
            btn.addEventListener('mouseleave', () => animateOptionLeave(btn));
            
            btn.addEventListener('click', () => handleAnswer(index, btn));
            
            optionsGrid.appendChild(btn);
        });
    }
    
    // Stagger animation for options
    gsap.fromTo('.option-btn',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }
    );
    
    questionStartTime = Date.now();
    startTimer();
    updateProgress();
}

function handleAnswer(selectedIndex, selectedBtn) {
    stopTimer();
    
    // Update AI tracker with analysis
    if (aiTracker && trackerText) {
        const responseTime = (Date.now() - questionStartTime) / 1000;
        if (responseTime < 4) {
            trackerText.textContent = '⚡ Speed demon detected';
        } else if (responseTime > 10) {
            trackerText.textContent = '🤔 Careful thinker mode';
        } else {
            trackerText.textContent = '✓ Balanced approach';
        }
    }
    
    const responseTime = (Date.now() - questionStartTime) / 1000;
    responseTimes.push(responseTime);
    
    const q = selectedQuestions[currentQuestion];
    const isCorrect = selectedIndex === q.correct;
    
    // Disable all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.add('disabled');
    });
    
    if (isCorrect) {
        correctAnswers++;
        streak++;
        maxStreak = Math.max(maxStreak, streak);
        
        // Track topic performance
        const topic = q.topic;
        if (!sessionTopicPerformance[topic]) {
            sessionTopicPerformance[topic] = { correct: 0, total: 0 };
        }
        sessionTopicPerformance[topic].correct++;
        sessionTopicPerformance[topic].total++;
        
        // Calculate score with streak and difficulty multiplier
        let base = q.points || (100 * Math.min(streak, 3));
        const mult = DIFFICULTY_SCORE_MULT[currentTier] || 1;
        let points = Math.round(base * mult);
        
        // Apply double points powerup
        if (activePowerups.doublePoints) {
            points *= 2;
            showAIToast('✖️2 DOUBLE POINTS SCORED!', 2000);
            activePowerups.doublePoints = false;
        }
        
        score += points;
        
        // Award powerup points for correct answers
        updatePowerupPoints(20);
        
        selectedBtn.classList.add('correct');
        celebrateCorrectAnswer();
        updateScore();
        updateStreak();
        
        // Check for badges
        checkAndAwardBadges();
        
        // AI celebrates streaks with personalized energy
        if (streak === 3) {
            const avgLast3 = responseTimes.slice(-3).reduce((a,b)=>a+b,0)/3;
            const msg = avgLast3 < 5 ? "Three straight and you're FLYING" : "Three in a row that's the rhythm";
            showAIToast(msg, 2000);
            
            // Additional AI hype via API
            generateStreakHype(3, avgLast3);
        } else if (streak === 5) {
            showAIToast("FIVE STREAK I see you now you're locked in", 2200);
            generateStreakHype(5, responseTimes.slice(-5).reduce((a,b)=>a+b,0)/5);
        }
        
        // Adjust difficulty and generate AI feedback
        adjustDifficultyOnAnswer(true, responseTime);
        
    } else {
        wrongAnswers++;
        streak = 0;
        
        // Reset double points powerup on wrong answer
        if (activePowerups.doublePoints) {
            activePowerups.doublePoints = false;
        }
        
        // Track topic performance
        const topic = q.topic;
        if (!sessionTopicPerformance[topic]) {
            sessionTopicPerformance[topic] = { correct: 0, total: 0 };
        }
        sessionTopicPerformance[topic].total++;
        
        selectedBtn.classList.add('wrong');
        vibrateWrongAnswer(selectedBtn);
        
        // Show correct answer
        const correctBtn = document.querySelector(`.option-btn[data-index="${q.correct}"]`);
        setTimeout(() => {
            correctBtn.classList.add('correct');
        }, 300);
        
        updateStreak();
        
        // AI encourages comeback with specific context
        if (maxStreak >= 3 && correctAnswers > 0) {
            setTimeout(() => {
                const msgs = [
                    `Lost the ${maxStreak}-streak but you're still in this`,
                    "Streak's gone but the game's not reset your mind",
                    `You had ${maxStreak} straight show me that again`
                ];
                showAIToast(msgs[Math.floor(Math.random() * msgs.length)], 2200);
            }, 1500);
        }
        
        // Adjust difficulty and generate AI feedback
        adjustDifficultyOnAnswer(false, responseTime);
    }
    
    // Reset 50/50 powerup for next question
    activePowerups.fiftyFiftyUsed = false;
    
    // Show comprehensive AI explanation after 1 second
    setTimeout(() => {
        generateComprehensiveExplanation(q, isCorrect, selectedIndex, responseTime);
    }, 1000);
}

function handleMultiAnswer(selectedIndices, submitBtn) {
    stopTimer();
    
    const responseTime = (Date.now() - questionStartTime) / 1000;
    responseTimes.push(responseTime);
    
    const q = selectedQuestions[currentQuestion];
    
    // Check if answer is correct (all correct indices selected, no wrong ones)
    const correctSet = new Set(q.correct);
    const selectedSet = new Set(selectedIndices);
    
    const isCorrect = correctSet.size === selectedSet.size && 
                      [...correctSet].every(i => selectedSet.has(i));
    
    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.add('disabled');
    });
    submitBtn.classList.add('disabled');
    
    if (isCorrect) {
        correctAnswers++;
        streak++;
        maxStreak = Math.max(maxStreak, streak);
        
        // Track topic performance
        const topic = q.topic;
        if (!sessionTopicPerformance[topic]) {
            sessionTopicPerformance[topic] = { correct: 0, total: 0 };
        }
        sessionTopicPerformance[topic].correct++;
        sessionTopicPerformance[topic].total++;
        
        // Calculate score with power-ups
        let points = q.points || 200;
        const mult = DIFFICULTY_SCORE_MULT[currentTier] || 1;
        points = Math.round(points * mult);
        
        if (activePowerups.doublePoints) {
            points *= 2;
            showAIToast('✖️2 DOUBLE POINTS SCORED!', 2000);
            activePowerups.doublePoints = false;
        }
        
        score += points;
        updatePowerupPoints(30); // Bonus for multi-answer
        
        // Show correct answers with green
        q.correct.forEach(idx => {
            const btn = document.querySelector(`.option-btn[data-index="${idx}"]`);
            if (btn) btn.classList.add('correct');
        });
        
        celebrateCorrectAnswer();
        updateScore();
        updateStreak();
        checkAndAwardBadges();
        
        showAIToast('Perfect! Got all the right answers', 2000);
        adjustDifficultyOnAnswer(true, responseTime);
        
    } else {
        wrongAnswers++;
        streak = 0;
        
        if (activePowerups.doublePoints) {
            activePowerups.doublePoints = false;
        }
        
        // Track topic performance
        const topic = q.topic;
        if (!sessionTopicPerformance[topic]) {
            sessionTopicPerformance[topic] = { correct: 0, total: 0 };
        }
        sessionTopicPerformance[topic].total++;
        
        // Show correct answers with green, wrong selections with red
        q.correct.forEach(idx => {
            const btn = document.querySelector(`.option-btn[data-index="${idx}"]`);
            if (btn) btn.classList.add('correct');
        });
        
        selectedIndices.forEach(idx => {
            if (!q.correct.includes(idx)) {
                const btn = document.querySelector(`.option-btn[data-index="${idx}"]`);
                if (btn) btn.classList.add('wrong');
            }
        });
        
        updateStreak();
        adjustDifficultyOnAnswer(false, responseTime);
    }
    
    activePowerups.fiftyFiftyUsed = false;
    
    // Show comprehensive AI explanation after 1 second
    setTimeout(() => {
        generateComprehensiveExplanation(q, isCorrect, selectedIndices, responseTime);
    }, 1000);
}


function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < TOTAL_QUESTIONS) {
        if (selectedQuestions.length <= currentQuestion) {
            ensureNextQuestionPrepared();
        }
        animateQuestionTransition();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    stopTimer();
    
    // Update user profile with session data
    updateUserProfile();
    
    // Save profile
    try {
        localStorage.setItem('quizUserProfile', JSON.stringify(userProfile));
    } catch (e) {
        console.error('Failed to save profile');
    }
    
    animateScreenTransition(quizScreen, resultsScreen);
    displayResults();
    generateFinalAISummary();
}

function updateScore() {
    gsap.to(scoreDisplay, {
        textContent: score,
        duration: 0.5,
        snap: { textContent: 1 },
        ease: 'power2.out'
    });
}

function updateStreak() {
    streakDisplay.textContent = streak;
    
    if (streak > 0) {
        streakFire.classList.add('active');
        gsap.fromTo(streakFire,
            { scale: 0.5 },
            { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
    } else {
        streakFire.classList.remove('active');
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
    currentQDisplay.textContent = currentQuestion + 1;
    progressPercent.textContent = `${Math.round(progress)}%`;
    progressFill.style.width = `${progress}%`;
}

function displayResults() {
    const accuracy = Math.round((correctAnswers / TOTAL_QUESTIONS) * 100);
    const avgResponseTime = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1);
    
    // Submit to leaderboard
    const playerName = activePowerups.playerName || 
                       userProfile.name || 
                       prompt('Enter your name for the leaderboard:') || 
                       'Player';
    
    if (!userProfile.name && playerName !== 'Player') {
        userProfile.name = playerName;
        saveProfile();
    }
    
    const isTeamMode = activePowerups.teamMode || false;
    const teamName = activePowerups.teamName || null;
    
    saveToLeaderboard(playerName, score, accuracy, isTeamMode, teamName);
    
    if (isTeamMode && teamName) {
        userProfile.teamModeWins++;
        saveProfile();
    }
    
    // Animate stats appearing
    gsap.fromTo(['.stat-card', '.ai-summary'],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
    
    // Animate values counting up
    gsap.to(accuracyStat, {
        textContent: `${accuracy}%`,
        duration: 1,
        ease: 'power2.out'
    });
    
    gsap.to(finalScore, {
        textContent: score,
        duration: 1,
        snap: { textContent: 1 },
        ease: 'power2.out'
    });
    
    avgSpeed.textContent = `${avgResponseTime}s`;
}

function resetQuiz() {
    playSound('click');
    currentQuestion = 0;
    
    // Reset team mode flags
    activePowerups.teamMode = false;
    activePowerups.teamName = null;
    activePowerups.playerName = null;
    
    animateScreenTransition(resultsScreen, welcomeScreen);
}

// ===== ADAPTIVE LOGIC =====
function adjustDifficultyOnAnswer(isCorrect, responseTime) {
    // Promote on fast streaks
    const recent = responseTimes.slice(-3);
    const fast = recent.length === 3 && (recent.reduce((a, b) => a + b, 0) / 3) <= 6;
    const canIncrease = DIFFICULTY_ORDER.indexOf(currentTier) < DIFFICULTY_ORDER.length - 1;
    const canDecrease = DIFFICULTY_ORDER.indexOf(currentTier) > 0;

    if (isCorrect && streak >= 3 && fast && canIncrease) {
        currentTier = DIFFICULTY_ORDER[DIFFICULTY_ORDER.indexOf(currentTier) + 1];
        updateDifficultyDisplay();
        const newLabel = DIFFICULTY_LABELS[currentTier];
        setTimeout(() => {
            showAIToast(`Bumping you to ${newLabel} those last answers were too easy for you`, 3000);
        }, 1200);
    }

    if (!isCorrect && wrongAnswers >= 2 && canDecrease) {
        currentTier = DIFFICULTY_ORDER[DIFFICULTY_ORDER.indexOf(currentTier) - 1];
        updateDifficultyDisplay();
        const newLabel = DIFFICULTY_LABELS[currentTier];
        setTimeout(() => {
            showAIToast(`Dialing back to ${newLabel} let's find your groove again`, 2800);
        }, 1200);
    }
}

// ===== ENHANCED AI EXPLANATION SYSTEM =====

// Create backdrop overlay
function createAIBackdrop() {
    if (document.getElementById('aiExplanationBackdrop')) return;
    
    const backdrop = document.createElement('div');
    backdrop.id = 'aiExplanationBackdrop';
    backdrop.className = 'ai-explanation-backdrop';
    document.getElementById('quizScreen').appendChild(backdrop);
    
    // Click backdrop to close (optional - can disable this)
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            // hideAIExplanationPanel(); // Uncomment to allow closing by clicking backdrop
        }
    });
}

// Create AI Explanation Panel HTML structure
function createAIExplanationPanel() {
    if (document.getElementById('aiExplanationPanel')) return;
    
    // Create backdrop first
    createAIBackdrop();
    
    const panel = document.createElement('div');
    panel.id = 'aiExplanationPanel';
    panel.className = 'ai-explanation-panel glass';
    panel.innerHTML = `
        <div class="ai-explanation-header">
            <div class="ai-avatar">🤖</div>
            <div class="ai-header-text">
                <h3 class="ai-tutor-name">AI Learning Assistant</h3>
                <p class="ai-status">Analyzing your response...</p>
            </div>
        </div>
        
        <div class="ai-explanation-content">
            <!-- Result Badge -->
            <div id="aiResultBadge" class="result-badge">
                <div class="badge-icon"></div>
                <div class="badge-text"></div>
            </div>
            
            <!-- Performance Summary -->
            <div class="performance-summary">
                <div class="summary-item">
                    <span class="summary-label">Response Time:</span>
                    <span id="aiResponseTime" class="summary-value">--</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Difficulty:</span>
                    <span id="aiDifficulty" class="summary-value">--</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Topic:</span>
                    <span id="aiTopic" class="summary-value">--</span>
                </div>
            </div>
            
            <!-- AI Personalized Message -->
            <div class="ai-message-box">
                <div class="message-label">💬 Personalized Feedback</div>
                <div id="aiPersonalizedMessage" class="message-content">
                    Generating your personalized feedback...
                </div>
            </div>
            
            <!-- Answer Explanation -->
            <div class="answer-explanation-box">
                <div class="explanation-label">📚 Answer Explanation</div>
                <div id="aiAnswerExplanation" class="explanation-content">
                    <div class="correct-answer-display">
                        <strong>Correct Answer:</strong> <span id="correctAnswerText">--</span>
                    </div>
                    <div id="detailedExplanation" class="detailed-explanation">
                        Loading explanation...
                    </div>
                </div>
            </div>
            
            <!-- Learning Insights -->
            <div class="learning-insights-box">
                <div class="insights-label">💡 Key Learning Points</div>
                <div id="aiLearningInsights" class="insights-content">
                    Generating insights...
                </div>
            </div>
            
            <!-- Next Action -->
            <div class="next-action">
                <button id="continueBtn" class="continue-button">
                    <span>Continue to Next Question</span>
                    <span class="arrow">→</span>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('quizScreen').appendChild(panel);
    aiExplanationPanel = panel;
    
    // Add event listener for continue button
    document.getElementById('continueBtn').addEventListener('click', () => {
        hideAIExplanationPanel();
        nextQuestion();
    });
}

// Show AI Explanation Panel with animation
function showAIExplanationPanel() {
    if (!aiExplanationPanel) createAIExplanationPanel();
    
    const backdrop = document.getElementById('aiExplanationBackdrop');
    
    // Show backdrop first
    if (backdrop) {
        backdrop.classList.add('show');
    }
    
    // Then show panel
    aiExplanationPanel.classList.add('show');
    
    gsap.fromTo(aiExplanationPanel,
        { opacity: 0, y: 50, scale: 0.95 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6, 
            ease: 'back.out(1.7)'
        }
    );
}

// Hide AI Explanation Panel
function hideAIExplanationPanel() {
    if (!aiExplanationPanel) return;
    
    const backdrop = document.getElementById('aiExplanationBackdrop');
    
    gsap.to(aiExplanationPanel, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
            aiExplanationPanel.classList.remove('show');
            // Hide backdrop after panel
            if (backdrop) {
                backdrop.classList.remove('show');
            }
        }
    });
}

// Generate comprehensive AI explanation after answer
async function generateComprehensiveExplanation(question, isCorrect, selectedIndex, responseTime) {
    createAIExplanationPanel();
    showAIExplanationPanel();
    
    const correctAnswer = Array.isArray(question.correct) 
        ? question.correct.map(i => question.options[i]).join(', ')
        : question.options[question.correct];
    
    const userAnswer = Array.isArray(selectedIndex)
        ? selectedIndex.map(i => question.options[i]).join(', ')
        : question.options[selectedIndex];
    
    // Update result badge
    const badge = document.getElementById('aiResultBadge');
    const badgeIcon = badge.querySelector('.badge-icon');
    const badgeText = badge.querySelector('.badge-text');
    
    if (isCorrect) {
        badge.className = 'result-badge correct';
        badgeIcon.textContent = '✓';
        badgeText.textContent = 'Correct!';
    } else {
        badge.className = 'result-badge incorrect';
        badgeIcon.textContent = '✗';
        badgeText.textContent = 'Incorrect';
    }
    
    // Update performance summary
    document.getElementById('aiResponseTime').textContent = `${responseTime.toFixed(1)}s`;
    document.getElementById('aiDifficulty').textContent = DIFFICULTY_LABELS[question.difficulty] || question.difficulty.toUpperCase();
    document.getElementById('aiTopic').textContent = question.topic.charAt(0).toUpperCase() + question.topic.slice(1);
    
    // Display correct answer
    document.getElementById('correctAnswerText').textContent = correctAnswer;
    
    // Show built-in explanation if available
    const detailedExp = document.getElementById('detailedExplanation');
    if (question.explanation) {
        detailedExp.textContent = question.explanation;
    } else {
        detailedExp.textContent = 'Generating detailed explanation...';
    }
    
    // Generate personalized AI feedback
    await generatePersonalizedFeedback(question, isCorrect, selectedIndex, userAnswer, correctAnswer, responseTime);
    
    // Generate learning insights
    await generateLearningInsights(question, isCorrect, responseTime);
}

// Generate personalized feedback based on performance
async function generatePersonalizedFeedback(question, isCorrect, selectedIndex, userAnswer, correctAnswer, responseTime) {
    const messageDiv = document.getElementById('aiPersonalizedMessage');
    messageDiv.innerHTML = '<div class="loading-dots">Analyzing<span>.</span><span>.</span><span>.</span></div>';
    
    const isVeryFast = responseTime < 4;
    const isSlow = responseTime > 10;
    const currentStreak = streak;
    const totalCorrect = correctAnswers;
    const totalWrong = wrongAnswers;
    
    // Context about user's learning style
    const avgSpeed = responseTimes.length > 0 
        ? (responseTimes.reduce((a,b) => a+b, 0) / responseTimes.length).toFixed(1)
        : responseTime.toFixed(1);
    
    const learningStyle = avgSpeed < 6 ? 'quick decision-maker' : 
                          avgSpeed < 10 ? 'thoughtful analyzer' : 
                          'careful deliberator';
    
    const prompt = `You are an AI learning tutor providing personalized feedback to a student who just answered a quiz question.

QUESTION CONTEXT:
- Question: "${question.question}"
- Topic: ${question.topic}
- Difficulty: ${question.difficulty}
- Student's answer: "${userAnswer}"
- Correct answer: "${correctAnswer}"
- Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}

STUDENT PERFORMANCE:
- Response time: ${responseTime.toFixed(1)}s (${isVeryFast ? 'very fast' : isSlow ? 'slow' : 'moderate'})
- Current streak: ${currentStreak}
- Session accuracy: ${totalCorrect}/${totalCorrect + totalWrong} correct
- Learning style: ${learningStyle}
- Average response time: ${avgSpeed}s

Generate a personalized feedback message (40-60 words) that:
1. ${isCorrect ? 'Acknowledges their correct answer with specific praise' : 'Empathetically explains what went wrong'}
2. Comments on their response time and decision-making
3. ${isCorrect ? 'Encourages them to maintain momentum' : 'Provides encouraging guidance for improvement'}
4. References their learning style and current performance pattern
5. Uses a friendly, supportive tutor voice

Make it feel personal and observant, like you've been watching their progress.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        if (response.ok) {
            const data = await response.json();
            const feedback = data.choices[0]?.message?.content?.trim() || 
                           'Great effort! Keep learning and improving.';
            
            // Typewriter effect
            typeWriter(messageDiv, feedback, 30);
        } else {
            throw new Error('API call failed');
        }
    } catch (error) {
        console.error('Error generating personalized feedback:', error);
        
        // Fallback personalized message
        const fallbackMessage = isCorrect 
            ? `Excellent work! You answered in ${responseTime.toFixed(1)}s. ${currentStreak > 0 ? `You're on a ${currentStreak}-question streak!` : 'Keep this momentum going!'} Your ${learningStyle} approach is working well for ${question.topic} questions.`
            : `You selected "${userAnswer}" but the correct answer is "${correctAnswer}". ${isSlow ? 'Take your time to think through each option.' : 'Consider all options carefully before selecting.'} Don't worry, ${question.topic} can be tricky. You're learning with each question!`;
        
        typeWriter(messageDiv, fallbackMessage, 30);
    }
}

// Generate learning insights and tips
async function generateLearningInsights(question, isCorrect, responseTime) {
    const insightsDiv = document.getElementById('aiLearningInsights');
    insightsDiv.innerHTML = '<div class="loading-dots">Generating insights<span>.</span><span>.</span><span>.</span></div>';
    
    const topicPerf = sessionTopicPerformance[question.topic];
    const topicAccuracy = topicPerf 
        ? ((topicPerf.correct / topicPerf.total) * 100).toFixed(0)
        : (isCorrect ? 100 : 0);
    
    const prompt = `You are an AI learning coach providing study insights after a quiz question.

CONTEXT:
- Question topic: ${question.topic}
- Difficulty: ${question.difficulty}
- Student result: ${isCorrect ? 'Correct' : 'Incorrect'}
- Topic accuracy so far: ${topicAccuracy}%
- Response time: ${responseTime.toFixed(1)}s

Generate 3 key learning insights (15-20 words each) that help the student:
1. A specific study tip related to this ${question.topic} topic
2. A strategy for approaching ${question.difficulty} difficulty questions
3. ${isCorrect ? 'How to maintain this performance level' : 'What to focus on to improve in this area'}

Format as a numbered list. Be specific, actionable, and encouraging.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 200
            })
        });

        if (response.ok) {
            const data = await response.json();
            const insights = data.choices[0]?.message?.content?.trim() || 
                           generateFallbackInsights(question, isCorrect, topicAccuracy);
            
            // Animate insights appearing
            insightsDiv.innerHTML = insights.replace(/\n/g, '<br>');
            gsap.fromTo(insightsDiv,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, delay: 0.3 }
            );
        } else {
            throw new Error('API call failed');
        }
    } catch (error) {
        console.error('Error generating insights:', error);
        insightsDiv.innerHTML = generateFallbackInsights(question, isCorrect, topicAccuracy);
    }
}

// Fallback insights if API fails
function generateFallbackInsights(question, isCorrect, topicAccuracy) {
    const insights = [
        `📖 ${question.topic.charAt(0).toUpperCase() + question.topic.slice(1)}: ${topicAccuracy >= 70 ? 'You\'re performing well in this topic! Continue practicing to maintain your edge.' : 'This topic needs more attention. Review key concepts and practice similar questions.'}`,
        `⚡ Speed Strategy: ${responseTime < 6 ? 'Your quick responses show confidence. Make sure accuracy stays high too!' : 'Take your time to analyze each option carefully. Accuracy is more important than speed.'}`,
        `🎯 Next Steps: ${isCorrect ? 'Build on this success by challenging yourself with harder questions.' : 'Learn from this mistake. Review the explanation and try similar practice questions.'}`
    ];
    
    return insights.join('<br><br>');
}

// ===== AI INTEGRATION =====
async function generateAIFeedback(type, responseTime) {
    const isVeryFast = responseTime < 4;
    const isSlow = responseTime > 10;
    const momentum = streak >= 2 ? 'HOT STREAK' : wrongAnswers >= 2 ? 'STRUGGLING' : 'BUILDING';
    const speedProfile = responseTimes.length >= 2 ? 
        (responseTimes.slice(-2).reduce((a,b)=>a+b,0)/2 < 6 ? 'speed demon' : 'methodical thinker') : 'unknown';
    
    const prompt = `You are a witty, observant AI coach analyzing a quiz player in REAL-TIME. You notice patterns and speak like you're watching them.

CONTEXT:
- Just answered: ${type === 'correct' ? 'CORRECTLY' : 'WRONG'} in ${responseTime.toFixed(1)}s (${isVeryFast ? 'lightning fast' : isSlow ? 'took their time' : 'decent speed'})
- Current momentum: ${momentum}
- Streak: ${streak} | Correct: ${correctAnswers} | Wrong: ${wrongAnswers}
- Difficulty: ${DIFFICULTY_LABELS[currentTier]}
- Player style: ${speedProfile}
- Question ${currentQuestion + 1}/${TOTAL_QUESTIONS}

Generate ONE coaching comment (MAX 12 words) that:
- References their SPECIFIC performance pattern ("that hesitation cost you" / "you're in a rhythm now")
- ${type === 'correct' ? 'Acknowledges the win but hints at the next challenge' : 'Identifies what went wrong and fires them up'}
- Sounds like YOU'RE WATCHING them, not generic motivation
- Uses natural coach language with personality
- NO emojis, NO period at end

Examples:
${type === 'correct' ? '"That speed is your weapon keep using it"\n"Barely thought and nailed it trust that instinct"\n"Three in a row now we\'re cooking with gas"' : '"Saw you second-guess yourself trust your gut next time"\n"That one got away but you\'re still in this"\n"Wrong answer right mindset bounce back now"'}`;

    console.log('🧠 AI FEEDBACK PROMPT:', prompt);

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 40,
                temperature: 1.0
            })
        });
        
        const data = await response.json();
        const message = data.choices[0].message.content.trim().replace(/[."'!]/g, '');
        console.log('✅ AI RESPONSE:', message);
        showAIToast(message);
        
        // Update tracker with AI insight
        if (aiTracker && trackerText) {
            setTimeout(() => {
                trackerText.textContent = type === 'correct' ? '✓ Impressed' : '↻ Analyzing';
            }, 500);
        }
    } catch (error) {
        console.error('AI Error:', error);
        // SMART CONTEXTUAL FALLBACKS - no API needed
        if (type === 'correct') {
            if (responseTime < 4) {
                const msgs = ["That was instant trust that speed", "Lightning fast keep that energy", "Barely blinked and got it"];
                showAIToast(msgs[Math.floor(Math.random() * msgs.length)]);
            } else if (streak >= 2) {
                showAIToast(`${streak} in a row you're finding your rhythm`);
            } else {
                const msgs = ["Nice one keep building", "That's it now momentum", "Clean answer stay locked in"];
                showAIToast(msgs[Math.floor(Math.random() * msgs.length)]);
            }
        } else {
            if (responseTime > 10) {
                showAIToast("Overthinking cost you trust your gut faster");
            } else if (wrongAnswers === 1) {
                showAIToast("First miss happens bounce back now");
            } else if (maxStreak >= 3) {
                showAIToast(`Lost the ${maxStreak}-streak but I saw what you can do`);
            } else {
                const msgs = ["That one got away reset", "Wrong answer right fight in you", "Shake it off next one's yours"];
                showAIToast(msgs[Math.floor(Math.random() * msgs.length)]);
            }
        }
    }
}

async function generateFinalAISummary() {
    const accuracy = Math.round((correctAnswers / TOTAL_QUESTIONS) * 100);
    const avgResponseTime = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1);
    const fastestTime = Math.min(...responseTimes).toFixed(1);
    const slowestTime = Math.max(...responseTimes).toFixed(1);
    const consistency = Math.abs(parseFloat(fastestTime) - parseFloat(slowestTime));
    
    const playStyle = avgResponseTime < 6 ? 'aggressive speed player' :
                     avgResponseTime > 10 ? 'careful analyzer' : 'balanced player';
    const strengthArea = maxStreak >= 3 ? 'streak building' :
                        avgResponseTime < 6 ? 'raw speed' :
                        accuracy >= 80 ? 'accuracy' : 'resilience';
    
    const prompt = `You are an AI coach who WATCHED this player's entire quiz session. Give them a personalized analysis that proves you were paying attention.

PERFORMANCE DATA:
- Accuracy: ${accuracy}% (${correctAnswers}/${TOTAL_QUESTIONS} correct)
- Play style: ${playStyle}
- Speed: avg ${avgResponseTime}s (fastest ${fastestTime}s, slowest ${slowestTime}s)
- Consistency: ${consistency < 5 ? 'very consistent' : 'volatile'}
- Max streak: ${maxStreak}
- Hesitations: ${hesitationCount}
- Ended on: ${DIFFICULTY_LABELS[currentTier]} difficulty
- Score: ${score}
- Defining strength: ${strengthArea}

Generate ONE analysis (35-45 words) that:
- SPECIFICALLY references their play patterns ("I noticed you speed up when confident" / "You hesitated on question 2 but recovered")
- Identifies their signature strength
- Points out ONE specific area to improve
- Feels like you KNOW them as a player
- Ends with a personal challenge for next time
- Natural coaching voice with personality`;

    console.log('🧠 AI SUMMARY PROMPT:', { accuracy, playStyle, strengthArea, maxStreak });

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 120,
                temperature: 0.9
            })
        });
        
        const data = await response.json();
        const summary = data.choices[0].message.content.trim();
        
        console.log('✅ AI SUMMARY:', summary);
        
        // Show AI is processing
        aiSummary.textContent = '🧠 Analyzing your performance...';
        
        // Animate typing effect
        setTimeout(() => {
            typeWriter(aiSummary, summary, 25);
        }, 800);
    } catch (error) {
        console.error('AI Error:', error);
        // SMART CONTEXTUAL SUMMARY - analyzes actual performance
        const speedStyle = avgResponseTime < 6 ? 'speed demon' : avgResponseTime > 10 ? 'careful thinker' : 'balanced';
        const strengthMsg = maxStreak >= 3 ? `Your ${maxStreak}-streak shows you can dominate when locked in.` :
                           avgResponseTime < 6 ? `That ${avgResponseTime}s average? Pure speed is your weapon.` :
                           accuracy >= 80 ? `${accuracy}% accuracy proves you know your stuff.` :
                           `${correctAnswers} correct answers - the foundation is there.`;
        
        const weaknessMsg = hesitationCount >= 2 ? `I saw ${hesitationCount} hesitations - trust your instincts faster.` :
                           consistency > 8 ? `Your times varied ${fastestTime}s to ${slowestTime}s - find consistency.` :
                           maxStreak < 2 ? `Build longer streaks to separate yourself.` :
                           `Push that speed up without sacrificing accuracy.`;
        
        const challenge = accuracy >= 80 ? `Can you go 5/5 perfect next time?` : 
                         maxStreak >= 3 ? `Ready to turn that streak into a full sweep?` :
                         `Let's see you break into ${DIFFICULTY_ORDER[Math.min(DIFFICULTY_ORDER.indexOf(currentTier) + 1, 2)]}.`;
        
        aiSummary.textContent = `${strengthMsg} ${weaknessMsg} ${challenge}`;
    }
}

function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== ADDITIONAL AI FEATURES =====
async function generateStreakHype(streakNum, avgSpeed) {
    const prompt = `You're an AI coach watching someone hit a ${streakNum}-streak in a quiz. Their average speed was ${avgSpeed.toFixed(1)}s. Generate ONE super hype reaction (10 words max) that's excited and personal. NO emojis.`;
    
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 30,
                temperature: 1.1
            })
        });
        
        const data = await response.json();
        const hype = data.choices[0].message.content.trim().replace(/[."'!]/g, '');
        
        setTimeout(() => {
            showAIToast(hype, 2500);
        }, 2200);
    } catch (error) {
        console.log('Streak hype generation skipped');
    }
}

async function generateAIExplanation(question) {
    const correctAnswer = question.options[question.correct];
    
    const prompt = `A student got this quiz question WRONG:
Question: ${question.question}
Correct answer: ${correctAnswer}
Topic: ${question.topic}

Generate ONE short coaching explanation (15-25 words) that:
- Explains WHY the correct answer is right
- Encourages them without being condescending
- Helps them learn the concept
- Uses a friendly coach voice
NO emojis.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 60,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        const explanation = data.choices[0].message.content.trim();
        
        console.log('📚 AI EXPLANATION:', explanation);
        showAIToast(explanation, 4000);
    } catch (error) {
        // Fallback to stored explanation
        if (question.explanation) {
            showAIToast(question.explanation, 3500);
        }
    }
}

function checkAndAwardBadges() {
    const badges = [
        { id: 'speed_demon', condition: () => responseTimes.every(t => t < 5), name: '⚡ Speed Demon', msg: 'Every answer under 5 seconds' },
        { id: 'perfect', condition: () => correctAnswers === TOTAL_QUESTIONS && wrongAnswers === 0, name: '💯 Perfect Score', msg: 'Flawless victory' },
        { id: 'comeback_king', condition: () => wrongAnswers >= 2 && streak >= 3, name: '👑 Comeback King', msg: 'Bounced back with a 3-streak' },
        { id: 'streak_master', condition: () => maxStreak >= 5, name: '🔥 Streak Master', msg: '5+ correct in a row' },
        { id: 'week_warrior', condition: () => userProfile.dailyStreak >= 7, name: '📅 Week Warrior', msg: '7 day streak' }
    ];
    
    badges.forEach(badge => {
        if (badge.condition() && !earnedBadgesThisSession.includes(badge.id) && !userProfile.badges.includes(badge.id)) {
            earnedBadgesThisSession.push(badge.id);
            userProfile.badges.push(badge.id);
            setTimeout(() => {
                showAIToast(`${badge.name} - ${badge.msg}`, 3000);
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }, 1000);
        }
    });
}

function updateUserProfile() {
    userProfile.totalQuizzes++;
    userProfile.totalQuestions += TOTAL_QUESTIONS;
    
    // Update topic strengths/weaknesses
    Object.keys(sessionTopicPerformance).forEach(topic => {
        const perf = sessionTopicPerformance[topic];
        const accuracy = perf.correct / perf.total;
        
        if (!userProfile.topicStrengths[topic]) userProfile.topicStrengths[topic] = 0;
        if (!userProfile.topicWeaknesses[topic]) userProfile.topicWeaknesses[topic] = 0;
        
        // Running average
        const prev = userProfile.topicWeaknesses[topic] || 0.5;
        userProfile.topicWeaknesses[topic] = (prev + accuracy) / 2;
        
        if (accuracy >= 0.8) {
            userProfile.topicStrengths[topic]++;
        }
    });
    
    // Update overall accuracy
    const sessionAccuracy = correctAnswers / TOTAL_QUESTIONS;
    const prevTotal = (userProfile.totalQuizzes - 1) * TOTAL_QUESTIONS;
    const prevCorrect = userProfile.overallAccuracy * prevTotal;
    userProfile.overallAccuracy = (prevCorrect + correctAnswers) / userProfile.totalQuestions;
    
    // Update best streak
    userProfile.bestStreak = Math.max(userProfile.bestStreak || 0, maxStreak);
    
    // Update avg response time
    const avgThisSession = responseTimes.reduce((a,b)=>a+b,0) / responseTimes.length;
    userProfile.avgResponseTime = userProfile.avgResponseTime 
        ? (userProfile.avgResponseTime + avgThisSession) / 2 
        : avgThisSession;
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle parallax to background
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to('.bg-gradient', {
            x: x,
            y: y,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Persist and display starting tier
    updateDifficultyDisplay();
    
    // Display user stats on welcome screen
    displayWelcomeStats();
    
    // Save latest tier at the end of a run
    window.addEventListener('beforeunload', () => {
        try { localStorage.setItem('startingTier', currentTier); } catch (_) {}
    });
});

function displayWelcomeStats() {
    // Update stats display
    if (document.getElementById('totalQuizzesDisplay')) {
        document.getElementById('totalQuizzesDisplay').textContent = userProfile.totalQuizzes || 0;
    }
    if (document.getElementById('overallAccuracyDisplay')) {
        const acc = Math.round((userProfile.overallAccuracy || 0) * 100);
        document.getElementById('overallAccuracyDisplay').textContent = `${acc}%`;
    }
    if (document.getElementById('dailyStreakDisplay')) {
        const streak = userProfile.dailyStreak || 0;
        document.getElementById('dailyStreakDisplay').textContent = streak > 0 ? `${streak}🔥` : '0';
    }
    
    // Display badges
    const badgesDisplay = document.getElementById('badgesDisplay');
    if (badgesDisplay && userProfile.badges.length > 0) {
        const badgeIcons = {
            'speed_demon': '⚡',
            'perfect': '💯',
            'comeback_king': '👑',
            'streak_master': '🔥',
            'week_warrior': '📅'
        };
        
        badgesDisplay.innerHTML = userProfile.badges
            .map(b => `<span class="badge-icon" title="${b}">${badgeIcons[b] || '🏆'}</span>`)
            .join('');
    }
}

// ===== DASHBOARD FUNCTIONS =====
function openDashboard() {
    playSound('click');
    animateScreenTransition(welcomeScreen, dashboardScreen);
    populateDashboard();
}

function closeDashboard() {
    playSound('click');
    animateScreenTransition(dashboardScreen, welcomeScreen);
}

function backToMenu() {
    playSound('click');
    
    // Hide AI explanation panel if it's showing
    if (aiExplanationPanel) {
        hideAIExplanationPanel();
    }
    
    // Stop timer if running
    stopTimer();
    
    // Show confirmation if quiz is in progress
    if (currentQuestion > 0 && currentQuestion < TOTAL_QUESTIONS) {
        const confirm = window.confirm('Are you sure you want to quit? Your progress will be lost.');
        if (!confirm) return;
    }
    
    // Reset and go back to welcome screen
    animateScreenTransition(quizScreen, welcomeScreen);
}

function populateDashboard() {
    // Overview stats
    document.getElementById('dash-accuracy').textContent = 
        `${Math.round((userProfile.overallAccuracy || 0) * 100)}%`;
    document.getElementById('dash-speed').textContent = 
        `${(userProfile.avgResponseTime || 0).toFixed(1)}s`;
    document.getElementById('dash-streak').textContent = userProfile.bestStreak || 0;
    document.getElementById('dash-total').textContent = userProfile.totalQuestions || 0;
    
    // Topic Performance
    populateTopicPerformance();
    
    // Achievements
    populateAchievements();
    
    // Performance Trends
    populatePerformanceTrends();
    
    // Study Recommendations
    populateStudyRecommendations();
    
    // Generate AI Insights
    generateDashboardInsights();
}

function populateTopicPerformance() {
    const topicPerf = document.getElementById('topicPerformance');
    if (!topicPerf) return;
    
    const topics = Object.keys(userProfile.topicWeaknesses || {});
    
    if (topics.length === 0) {
        topicPerf.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No topic data yet. Complete a quiz to see analytics!</p>';
        return;
    }
    
    topicPerf.innerHTML = topics.map(topic => {
        const accuracy = (userProfile.topicWeaknesses[topic] || 0) * 100;
        const questions = userProfile.topicStrengths[topic] || 0;
        const color = accuracy >= 80 ? 'var(--correct)' : accuracy >= 60 ? 'var(--cyan)' : 'var(--wrong)';
        
        return `
            <div class="topic-item">
                <div class="topic-info">
                    <div class="topic-name">${topic}</div>
                    <div class="topic-stats">${questions} questions answered</div>
                </div>
                <div class="topic-bar">
                    <div class="topic-bar-fill" style="width: ${accuracy}%; background: ${color}"></div>
                </div>
                <div class="topic-accuracy" style="color: ${color}">${accuracy.toFixed(0)}%</div>
            </div>
        `;
    }).join('');
}

function populateAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) return;
    
    const allBadges = [
        { id: 'speed_demon', icon: '⚡', name: 'Speed Demon', desc: 'All answers under 5 seconds' },
        { id: 'perfect', icon: '💯', name: 'Perfect Score', desc: 'Flawless 5/5 quiz' },
        { id: 'comeback_king', icon: '👑', name: 'Comeback King', desc: 'Bounce back with 3-streak' },
        { id: 'streak_master', icon: '🔥', name: 'Streak Master', desc: '5+ correct in a row' },
        { id: 'week_warrior', icon: '📅', name: 'Week Warrior', desc: '7 day streak' },
        { id: 'centurion', icon: '💪', name: 'Centurion', desc: '100+ questions answered' },
        { id: 'ace', icon: '🎯', name: 'Ace', desc: '90%+ overall accuracy' },
        { id: 'lightning', icon: '⚡️', name: 'Lightning Fast', desc: 'Avg response under 3s' }
    ];
    
    achievementsGrid.innerHTML = allBadges.map(badge => {
        const unlocked = userProfile.badges.includes(badge.id) || checkBadgeCondition(badge.id);
        return `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${badge.icon}</div>
                <div class="achievement-name">${badge.name}</div>
                <div class="achievement-desc">${badge.desc}</div>
            </div>
        `;
    }).join('');
}

function checkBadgeCondition(badgeId) {
    switch(badgeId) {
        case 'centurion': return userProfile.totalQuestions >= 100;
        case 'ace': return userProfile.overallAccuracy >= 0.9;
        case 'lightning': return userProfile.avgResponseTime < 3;
        default: return false;
    }
}

function populatePerformanceTrends() {
    const trendsContent = document.getElementById('performanceTrends');
    if (!trendsContent) return;
    
    const quizCount = userProfile.totalQuizzes || 0;
    const streakDays = userProfile.dailyStreak || 0;
    const avgAcc = Math.round((userProfile.overallAccuracy || 0) * 100);
    
    trendsContent.innerHTML = `
        <div class="trend-item">
            <div class="trend-icon">📈</div>
            <div class="trend-info">
                <div class="trend-label">Total Quizzes Completed</div>
                <div class="trend-value">${quizCount}</div>
            </div>
        </div>
        <div class="trend-item">
            <div class="trend-icon">🔥</div>
            <div class="trend-info">
                <div class="trend-label">Current Daily Streak</div>
                <div class="trend-value">${streakDays} ${streakDays === 1 ? 'day' : 'days'}</div>
            </div>
        </div>
        <div class="trend-item">
            <div class="trend-icon">${avgAcc >= 80 ? '🌟' : avgAcc >= 60 ? '📊' : '💪'}</div>
            <div class="trend-info">
                <div class="trend-label">Overall Performance Level</div>
                <div class="trend-value">${avgAcc >= 80 ? 'Expert' : avgAcc >= 60 ? 'Intermediate' : 'Developing'}</div>
            </div>
        </div>
    `;
}

function populateStudyRecommendations() {
    const studyRecs = document.getElementById('studyRecs');
    if (!studyRecs) return;
    
    // Find weakest topics
    const topics = Object.entries(userProfile.topicWeaknesses || {})
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3);
    
    if (topics.length === 0) {
        studyRecs.innerHTML = '<p style="color: var(--text-secondary); padding: 16px;">Complete more quizzes to get personalized recommendations!</p>';
        return;
    }
    
    studyRecs.innerHTML = topics.map(([topic, accuracy]) => {
        const acc = Math.round(accuracy * 100);
        const recommendations = {
            astronomy: 'Review planetary facts, distances, and key characteristics of celestial bodies.',
            geography: 'Study world capitals, major oceans, continents, and geographical features.',
            art: 'Learn about famous artists, art movements, and masterpiece paintings.',
            physics: 'Focus on fundamental constants, laws of motion, and basic physics principles.',
            history: 'Review major historical events, dates, and influential figures.',
            science: 'Strengthen understanding of scientific methods and key discoveries.'
        };
        
        return `
            <div class="study-rec-item">
                <div class="study-rec-topic">${topic} (${acc}% accuracy)</div>
                <div class="study-rec-text">${recommendations[topic] || 'Focus on this topic in your next quiz sessions.'}</div>
            </div>
        `;
    }).join('');
}

async function generateDashboardInsights() {
    const insightsDiv = document.getElementById('aiInsights');
    if (!insightsDiv) return;
    
    const topics = Object.entries(userProfile.topicWeaknesses || {});
    const weakestTopic = topics.sort((a, b) => a[1] - b[1])[0];
    const strongestTopic = topics.sort((a, b) => b[1] - a[1])[0];
    const avgAcc = Math.round((userProfile.overallAccuracy || 0) * 100);
    
    const prompt = `You are an AI learning coach analyzing a student's quiz performance data:

PERFORMANCE SUMMARY:
- Total quizzes: ${userProfile.totalQuizzes || 0}
- Overall accuracy: ${avgAcc}%
- Average response time: ${(userProfile.avgResponseTime || 0).toFixed(1)}s
- Best streak: ${userProfile.bestStreak || 0}
- Daily streak: ${userProfile.dailyStreak || 0} days
- Strongest topic: ${strongestTopic ? `${strongestTopic[0]} (${Math.round(strongestTopic[1] * 100)}%)` : 'None yet'}
- Weakest topic: ${weakestTopic ? `${weakestTopic[0]} (${Math.round(weakestTopic[1] * 100)}%)` : 'None yet'}

Generate a personalized analysis (60-80 words) that:
1. Identifies 2-3 specific patterns in their performance
2. Highlights what they're doing well
3. Gives 2 actionable improvement strategies
4. Motivates them with a specific challenge
Use a supportive coach voice. Be specific, not generic.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 180,
                temperature: 0.8
            })
        });
        
        const data = await response.json();
        const insights = data.choices[0].message.content.trim();
        
        insightsDiv.innerHTML = `<p>${insights}</p>`;
    } catch (error) {
        // Fallback insights
        let fallbackInsight = '';
        
        if (avgAcc >= 80) {
            fallbackInsight = `Exceptional work! Your ${avgAcc}% accuracy puts you in expert territory. `;
        } else if (avgAcc >= 60) {
            fallbackInsight = `Solid performance at ${avgAcc}% accuracy. You're building a strong foundation. `;
        } else {
            fallbackInsight = `You're in the learning phase at ${avgAcc}%. Every quiz is building your knowledge. `;
        }
        
        if (weakestTopic) {
            fallbackInsight += `Focus on ${weakestTopic[0]} where you're at ${Math.round(weakestTopic[1] * 100)}% - that's your biggest opportunity for growth. `;
        }
        
        if (userProfile.dailyStreak >= 3) {
            fallbackInsight += `Your ${userProfile.dailyStreak}-day streak shows commitment. Keep the momentum! `;
        } else {
            fallbackInsight += `Build a daily practice streak to lock in long-term retention. `;
        }
        
        fallbackInsight += `Challenge: Can you beat your best streak of ${userProfile.bestStreak || 0} in your next session?`;
        
        insightsDiv.innerHTML = `<p>${fallbackInsight}</p>`;
    }
}
// ===== POWER-UPS SYSTEM =====
function updatePowerupPoints(amount) {
    const gameState = getGameState();
    gameState.powerupPoints = Math.max(0, (gameState.powerupPoints || 200) + amount);
    saveGameState(gameState);
    
    if (powerupPointsDisplay) {
        powerupPointsDisplay.textContent = gameState.powerupPoints;
        gsap.fromTo(powerupPointsDisplay, 
            { scale: 1.3, color: amount > 0 ? '#4ade80' : '#f87171' },
            { scale: 1, color: '#ffffff', duration: 0.5 }
        );
    }
}

function getGameState() {
    return {
        currentQuestionIndex: currentQuestion,
        score: score,
        streak: streak,
        powerupPoints: parseInt(powerupPointsDisplay?.textContent || '200'),
        activePowerups: activePowerups
    };
}

function saveGameState(state) {
    // Just update display for now (can add localStorage if needed)
}

function usePowerup(type) {
    const powerup = POWERUPS[type];
    if (!powerup) return;
    
    const currentPoints = parseInt(powerupPointsDisplay.textContent);
    
    if (currentPoints < powerup.cost) {
        showAIToast('Not enough points for this power-up!', 2000);
        return;
    }
    
    // Prevent using same powerup multiple times per question
    if (type === 'FIFTY_FIFTY' && activePowerups.fiftyFiftyUsed) {
        showAIToast('50/50 already used on this question!', 2000);
        return;
    }
    
    updatePowerupPoints(-powerup.cost);
    userProfile.powerupsUsed++;
    saveProfile();
    
    playSound('correct');
    
    switch(type) {
        case 'HINT':
            generateAIHint();
            break;
        case 'FIFTY_FIFTY':
            applyFiftyFifty();
            break;
        case 'TIME_FREEZE':
            applyTimeFreeze();
            break;
        case 'DOUBLE_POINTS':
            applyDoublePoints();
            break;
    }
}

async function generateAIHint() {
    const currentQ = selectedQuestions[currentQuestion];
    
    const prompt = `Question: ${currentQ.question}

Options: ${currentQ.options.join(', ')}

Correct answer: ${currentQ.options[currentQ.correct]}

Give a strategic hint (20-30 words) that helps them reason through the answer WITHOUT directly revealing it. Use logic cues, elimination strategy, or context clues.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 80,
                temperature: 0.9
            })
        });
        
        const data = await response.json();
        const hint = data.choices[0].message.content.trim();
        
        showAIToast(`💡 Hint: ${hint}`, 6000);
    } catch (error) {
        showAIToast('💡 Think about which option seems most logical based on what you know!', 4000);
    }
}

function applyFiftyFifty() {
    const currentQ = selectedQuestions[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    if (currentQ.type === 'multiple-answer') {
        showAIToast('50/50 not available for multi-answer questions!', 2000);
        updatePowerupPoints(POWERUPS.FIFTY_FIFTY.cost); // Refund
        return;
    }
    
    const wrongIndices = [];
    options.forEach((opt, idx) => {
        if (idx !== currentQ.correct && !opt.classList.contains('disabled')) {
            wrongIndices.push(idx);
        }
    });
    
    // Disable 2 random wrong answers
    const toDisable = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    toDisable.forEach(idx => {
        options[idx].classList.add('disabled');
        options[idx].style.opacity = '0.3';
        options[idx].style.pointerEvents = 'none';
    });
    
    activePowerups.fiftyFiftyUsed = true;
    showAIToast('➗ Removed 2 wrong answers!', 2000);
}

function applyTimeFreeze() {
    timeLeft += 10;
    currentMaxTime += 10;
    updateTimerDisplay();
    
    gsap.fromTo(timerCircle, 
        { stroke: '#3b82f6' },
        { stroke: '#10b981', duration: 0.5, yoyo: true, repeat: 1 }
    );
    
    showAIToast('⏰ Added 10 seconds!', 2000);
}

function applyDoublePoints() {
    activePowerups.doublePoints = true;
    
    gsap.fromTo(scoreDisplay, 
        { scale: 1.2, color: '#fbbf24' },
        { scale: 1, color: '#ffffff', duration: 1, repeat: 2, yoyo: true }
    );
    
    showAIToast('✖️2 Next answer worth DOUBLE points!', 2000);
}

// ===== LEADERBOARD SYSTEM =====
function getLeaderboard() {
    const stored = localStorage.getItem('quizLeaderboard');
    return stored ? JSON.parse(stored) : [];
}

function saveToLeaderboard(playerName, score, accuracy, isTeam = false, teamName = null) {
    const leaderboard = getLeaderboard();
    
    const entry = {
        name: playerName,
        score: score,
        accuracy: accuracy,
        date: new Date().toISOString(),
        isTeam: isTeam,
        teamName: teamName
    };
    
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep top 100
    const trimmed = leaderboard.slice(0, 100);
    localStorage.setItem('quizLeaderboard', JSON.stringify(trimmed));
    
    return trimmed;
}

function openLeaderboard() {
    playSound('click');
    animateScreenTransition(welcomeScreen, leaderboardScreen);
    populateLeaderboard('global');
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateLeaderboard(btn.dataset.tab);
        });
    });
}

function closeLeaderboard() {
    playSound('click');
    animateScreenTransition(leaderboardScreen, welcomeScreen);
}

function populateLeaderboard(tab) {
    const leaderboard = getLeaderboard();
    let filtered = [...leaderboard];
    
    if (tab === 'team') {
        filtered = filtered.filter(e => e.isTeam);
    } else if (tab === 'daily') {
        const today = new Date().toDateString();
        filtered = filtered.filter(e => new Date(e.date).toDateString() === today);
    }
    
    if (filtered.length === 0) {
        leaderboardContent.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:40px;">No entries yet. Be the first!</p>';
        return;
    }
    
    let html = '<div class="leaderboard-list">';
    
    filtered.slice(0, 20).forEach((entry, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
        const displayName = entry.isTeam ? `${entry.teamName} (Team)` : entry.name;
        
        html += `
            <div class="leaderboard-entry ${idx < 3 ? 'top-three' : ''}">
                <div class="rank">${medal}</div>
                <div class="entry-details">
                    <div class="entry-name">${displayName}</div>
                    <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                </div>
                <div class="entry-stats">
                    <div class="entry-score">${entry.score} pts</div>
                    <div class="entry-accuracy">${entry.accuracy}%</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    leaderboardContent.innerHTML = html;
}

// ===== TEAM MODE =====
function openTeamSetup() {
    playSound('click');
    animateScreenTransition(welcomeScreen, teamSetupScreen);
}

function closeTeamSetup() {
    playSound('click');
    animateScreenTransition(teamSetupScreen, welcomeScreen);
}

function startTeamQuiz() {
    const playerName = document.getElementById('playerNameInput').value.trim();
    const teamName = document.getElementById('teamNameInput').value.trim();
    const teamSize = document.getElementById('teamSizeSelect').value;
    
    if (!playerName || !teamName) {
        showAIToast('Please enter both your name and team name!', 2000);
        return;
    }
    
    // Store team info in game state
    activePowerups.teamMode = true;
    activePowerups.teamName = teamName;
    activePowerups.playerName = playerName;
    activePowerups.teamSize = parseInt(teamSize);
    activePowerups.teamScore = 0;
    
    playSound('click');
    animateScreenTransition(teamSetupScreen, quizScreen);
    resetGameState();
    initializeQuestionPool();
    ensureNextQuestionPrepared();
    
    showAIToast(`Team ${teamName} - Let's dominate this quiz!`, 3000);
    
    animateQuestionTransition();
}