# Advanced Quiz Game Features

## 🚀 New Features Added

### 💡 Power-Ups System

- **💡 Hint (50 pts)**: AI generates strategic hints without revealing the answer
- **➗ 50/50 (75 pts)**: Removes 2 wrong answers (not available for multi-answer questions)
- **⏰ Time Freeze (100 pts)**: Adds 10 seconds to the timer
- **✖️2 Double Points (150 pts)**: Next correct answer worth 2x points

**How it works:**

- Start with 200 powerup points
- Earn 20 points for each correct answer (30 for multi-answer)
- Points display at top of powerup bar
- Click powerup buttons during quiz to activate

### 🏆 Leaderboard System

- **Global Leaderboard**: Top 100 players by score
- **Team Leaderboard**: Filter to see only team mode scores
- **Daily Leaderboard**: Today's top scores
- Displays: Rank (🥇🥈🥉), Player/Team Name, Score, Accuracy, Date
- Auto-submits score after each quiz
- Persistent storage using localStorage

### 👥 Team Mode

1. Click "TEAM MODE" button on welcome screen
2. Enter your name and team name
3. Select team size (2-4 players)
4. Play quiz collaboratively
5. Team scores tracked separately on leaderboard

### 📊 Enhanced Question Types

#### Multiple Choice (Standard)

- 4 options, 1 correct answer
- Click to select

#### Math Calculation

- Calculate numeric answers
- Show calculation steps in explanations

#### Multiple Answer

- Select ALL correct answers
- Click multiple options to select/deselect
- Visual feedback: Selected options highlighted in purple
- Click "✓ Submit Answer" button when ready
- Earns bonus powerup points (30 vs 20)

### 🎯 Updated Scoring System

- Base points from question difficulty
- Multiplier based on current difficulty tier (1.0x - 1.5x)
- Double Points powerup multiplies final score by 2x
- Points awarded per question: 100-200 base

### 📈 Analytics Dashboard

- View detailed performance metrics
- Topic strengths/weaknesses
- Badge achievements
- AI-generated insights
- Performance trends
- Study recommendations

### 🎮 UI/UX Improvements

- Powerup bar with points display above quiz questions
- Multi-answer questions show visual selection state
- Submit button for multi-answer questions
- Team mode setup form
- Leaderboard with tab switching
- Glassmorphism design
- Smooth GSAP animations

## 🎯 How to Use

1. **Solo Mode**: Click "START CHALLENGE" for standard quiz
2. **Team Mode**: Click "TEAM MODE" to play collaboratively
3. **During Quiz**:
   - Answer questions normally
   - Use powerups strategically (click powerup buttons)
   - For multi-answer: select all correct options, then Submit
4. **After Quiz**:
   - View results and AI analysis
   - Check leaderboard ranking
   - View analytics dashboard for detailed insights

## 🔧 Technical Details

### Storage

- User profile: `localStorage.quizUserProfile`
- Leaderboard: `localStorage.quizLeaderboard`
- Settings: `localStorage.startingTier`

### AI Integration

- Groq API with llama-3.3-70b-versatile
- Used for: hints, feedback, explanations, insights
- Fallbacks for offline/error scenarios

### Performance

- Lazy loading of questions
- Efficient state management
- Optimized animations with GSAP
- Responsive design (mobile-friendly)
