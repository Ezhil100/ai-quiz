# AI-Powered Quiz Game 🎮

An interactive, gamified quiz website with AI engagement powered by Groq API.

## 🚀 Features

### 🧠 AI-First Engagement Experience

- **AI Quiz Coach** - Your personal competitive coach watches EVERY move
- **Real-Time Reactions** - AI celebrates streaks, motivates comebacks, pushes urgency
- **Strategic Feedback** - Personalized messages based on speed, accuracy, and difficulty
- **Milestone Celebrations** - Special reactions at 3-streak, 5-streak, level-ups
- **Comeback Motivation** - AI fires you up after mistakes with champion mentality
- **Performance Analysis** - Deep AI breakdown of your signature strengths
- **Urgency Coaching** - AI pushes you when time is running low

### Gamification

- ✨ **Score System** with multipliers
- 🔥 **Streak Counter** - Keep answering correctly!
- ⏱️ **Time Bonuses** - Answer quickly for extra points
- 🎯 **Accuracy Tracking**
- 🎊 **Confetti Celebrations**
- 💡 **Hint System** (costs 20 points)

### Adaptive Difficulty (Foundational)

- 📈 3 Tiers: Easy / Medium / Hard
- 🔄 Mid-quiz adjustments based on streak and speed
- ⏱️ Dynamic timers per difficulty
- 🏷️ Difficulty HUD and transparent feedback

### Modern Design

- Beautiful gradient animations
- Smooth transitions and effects
- Floating particle background
- Responsive design for all devices
- Interactive button hover effects
- Typing indicator for AI messages

## 📋 Setup Instructions

### 1. Get Your Free Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the key

### 2. Configure the Quiz

1. Copy `config.example.js` to `config.js`
2. Open `config.js`
3. Set `GROQ_API_KEY` to your actual Groq API key
4. Save the file

### 3. Run the Quiz

Simply open `index.html` in any modern web browser!

### 4. Optional: Starting Difficulty Persistence

- The game remembers your last difficulty tier using `localStorage`.
- To reset, clear site data or run in a new session.

## 🎯 How to Play

1. Click **"Start Adventure"** to begin
2. Read each question carefully
3. Select your answer before time runs out (15 seconds)
4. Watch your score and streak grow!
5. Use hints if you're stuck (costs points)
6. Complete all 5 questions to see your results

## 📊 Scoring System

- **Base Points**: 100 per correct answer
- **Difficulty Multiplier**: Easy x1.0, Medium x1.2, Hard x1.5
- **Time Bonus**: +50 points (if answered in <5 seconds)
- **Streak Bonus**: +10 points per streak level (3+ streak)
- **No Hint Bonus**: +20 points
- **Hint Penalty**: -20 points

## 🎨 Technologies Used

- **HTML5** - Structure
- **CSS3** - Modern animations & styling
- **JavaScript** - Game logic
- **Groq API** - AI-powered engagement (using Mixtral-8x7b model)
- **Canvas Confetti** - Celebration effects

## 🔧 Customization

### Add More Questions

Edit the `quizData` array in `script.js`:

```javascript
const quizData = [
  {
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correct: 0, // Index of correct answer (0-3)
    category: "Category",
  },
  // Add more questions...
];
```

### Adjust Timer

Change the timer duration in `script.js` (line 45):

```javascript
let timeLeft = 15; // Change to desired seconds
```

### Modify AI Behavior

Adjust AI prompts in the `sendAIMessage()` function to customize how the AI responds.

## 🌟 AI Engagement Features (THE CORE EXPERIENCE)

**The AI coach is YOUR constant companion:**

- ✅ Welcomes you with competitive energy
- ✅ Celebrates EVERY correct answer with personalized hype
- ✅ Pushes you through hesitation ("Trust your gut!")
- ✅ Goes WILD at streak milestones (3-streak 🔥, 5-streak 🔥🔥)
- ✅ Motivates comebacks after breaking streaks
- ✅ Announces difficulty changes like level-ups
- ✅ Pushes urgency when time is low
- ✅ Delivers deep, personalized post-game analysis
- ✅ Uses champion mentality language throughout

**The AI sees:**

- Your response speed patterns
- Streak consistency vs volatility
- Difficulty progression
- Hesitation moments
- Your signature move (speed demon? streak master? comeback king?)

**Goal: Make you feel like you have a REAL coach in your corner**

## 📱 Browser Compatibility

Works on all modern browsers:

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🎭 Demo Questions Included

1. **Science**: Which planet is known as the Red Planet?
2. **Art**: Who painted the Mona Lisa?
3. **Geography**: What is the largest ocean on Earth?
4. **History**: In which year did World War II end?
5. **Mathematics**: What is the smallest prime number?

## 💡 Tips for Best Experience

- Use a modern browser for best animations
- Enable sound for full experience
- Try to maintain a streak for bonus points!
- The AI gets more excited with higher streaks
- Answer quickly for time bonuses

## 🚀 Future Enhancements

- Sound effects
- 5-tier adaptive difficulty (Struggling → Mastery)
- Category selection
- Leaderboard system
- More questions
- Power-ups
- Multiplayer mode

## 📝 License

Free to use and modify for educational purposes!

---

**Enjoy the quiz!** 🎉 Let the AI make your learning experience more engaging and fun!
