# 🌸 Japanese Hiragana & Katakana Learning Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=github-pages)](https://haibara406.github.io/Japan-Fifty-Sounds-Learning)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Language](https://img.shields.io/badge/Language-JavaScript-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

*A comprehensive, interactive web application for learning Japanese Hiragana and Katakana characters*

[🇨🇳 中文](README_CN.md) | [🇺🇸 English](README.md) | [🇯🇵 日本語](README_JP.md)

</div>

## 🎯 Overview

This is a modern, feature-rich web application designed to help beginners systematically master Japanese Hiragana and Katakana characters. The platform offers multiple learning modes, intelligent progress tracking, and gamification elements to make learning engaging and effective.

**🌐 Live Demo**: [https://haibara406.github.io/Japan-Fifty-Sounds-Learning](https://haibara406.github.io/Japan-Fifty-Sounds-Learning)

## ✨ Key Features

### 📚 Multiple Learning Modes
- **Browse Mode**: Interactive 50-sound chart with Hiragana/Katakana switching
- **Practice Mode**: Recognition, writing, and listening exercises
- **Test Mode**: Timed quizzes with instant feedback and detailed reports
- **Flashcard Mode**: Flip-card design with difficulty marking
- **Progress Tracking**: Visual progress monitoring with detailed analytics

### 🎯 Intelligent Learning System
- **Scientific Mastery Criteria**: Requires 3 consecutive correct answers to master a character
- **Tiered Learning States**: Unlearned (gray) → Learning (yellow) → Mastered (green)
- **Separate Tracking**: Independent progress tracking for Hiragana and Katakana
- **Personalized Practice**: Smart content recommendation based on mastery level

### 🏆 Gamification & Motivation
- **Level System**: 10 levels with 100 points per level advancement
- **Point Rewards**: +5 for correct answers, +10 for mastery, up to 50 for tests
- **Achievement System**: 14 unlockable achievements with animated notifications
- **Visual Progress**: Intuitive progress bars and statistical charts

### 💾 Data Management
- **Local Storage**: Automatic progress saving to browser
- **Data Export**: JSON backup and HTML learning reports
- **Data Import**: Restore previous learning progress
- **Detailed Reports**: Comprehensive HTML-formatted learning analytics

## 🎮 User Guide

### Browse Mode
- Click any character card to toggle between Hiragana/Katakana display
- Use top-right buttons to switch all cards to specific script type
- Card colors indicate learning status: Gray (unlearned), Yellow (learning), Green (mastered)

### Practice Mode
- **Recognition**: View character, select romanization
- **Writing**: View romanization, input character
- **Listening**: View character, select romanization (no audio)
- Support for row-specific or full 50-sound practice
- Master characters by answering correctly 3 times consecutively

### Test Mode
- 20 timed questions, 10 seconds per question
- Immediate feedback after selection, 3-second delay before next question
- Stop test anytime
- Detailed results and point rewards upon completion

### Flashcard Mode
- Click cards to flip and view romanization
- Mark as "easy" for instant mastery or "difficult" for more practice
- Shuffle and auto-play functionality
- Keyboard shortcuts: Arrow keys for navigation, Spacebar to flip

### Progress Tracking
- View overall mastery and row-specific progress
- Separate progress display for Hiragana and Katakana
- Detailed statistics: study days, time spent, accuracy rate
- Click "Progress Guide" for detailed recording mechanism

## 🎨 Design Features

- **Modern UI**: Clean, beautiful Material Design aesthetic
- **Responsive Layout**: Perfect adaptation for desktop and mobile devices
- **Smooth Animations**: Card flips, level-ups, and other polished effects
- **Intuitive Feedback**: Clear visual feedback for all interactions
- **Theme Support**: Automatic system theme preference adaptation

## 📊 Progress Tracking System

### Mastery Calculation
- **Unlearned**: Characters never encountered
- **Learning**: Clicked in browse mode or answered correctly 1-2 times
- **Mastered**: 3 consecutive correct answers or marked as "easy" in flashcards
- **Important**: Hiragana and Katakana calculated separately

### Points & Levels
- Practice correct answer: +5 points
- Character mastery (3 consecutive): +10 points
- Test rewards: 20-50 points based on accuracy
- Level advancement: Every 100 points, earn new title

### Learning Statistics
- **Study Days**: Automatically recorded on first daily use
- **Study Time**: Active page time, recorded every minute
- **Accuracy Rate**: Total correct answers ÷ Total questions × 100%

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5 + CSS3 + JavaScript
- **Styling**: CSS Grid + Flexbox, CSS custom properties theme system
- **Fonts**: Google Fonts (Noto Sans JP + Noto Sans SC)
- **Icons**: Font Awesome 6.0
- **Storage**: localStorage for data persistence
- **Animations**: CSS Keyframes animations

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 Learning Recommendations

1. **Start with Browse Mode**: Familiarize yourself with character shapes and sounds
2. **Progressive Practice**: Master あ-row first, then proceed row by row
3. **Hiragana First**: Recommended to master Hiragana before Katakana
4. **Regular Testing**: Use test mode to verify learning effectiveness
5. **Consistent Review**: Use flashcard mode to reinforce learned content

## 📈 Recommended Learning Path

### Beginner (Levels 0-2)
- Browse mode to familiarize with character shapes
- Start with あ-row recognition practice

### Intermediate (Levels 3-5)
- Complete all Hiragana recognition exercises
- Begin writing practice
- Regular testing

### Advanced (Levels 6-10)
- Learn Katakana
- Mixed Hiragana and Katakana practice
- Pursue higher accuracy and speed

## 🏆 Achievement System

Unlock 14 different achievements including:
- **First Step**: Complete first practice
- **Practice Master**: Complete 100 practice questions
- **Accuracy Expert**: Achieve 90%+ accuracy
- **Hiragana/Katakana Master**: Master all basic characters
- **Persistent Learner**: Study for 7 consecutive days
- **Level Achievements**: Reach specific levels
- And more...

## 🚀 Getting Started

Simply visit the live demo to start learning immediately:

**🌐 [Launch Application](https://haibara406.github.io/Japan-Fifty-Sounds-Learning)**

No installation required - the application runs entirely in your browser with all data stored locally.

## 📸 Screenshots

### Browse Mode - Interactive 50-Sound Chart
The main learning interface with clickable character cards that switch between Hiragana and Katakana.

### Practice Mode - Multiple Exercise Types
Comprehensive practice system with recognition, writing, and listening exercises.

### Achievement System - Gamified Learning
Unlock achievements and track your progress with detailed statistics.

## 🔧 Features in Detail

### Learning Modes
| Mode | Description | Key Features |
|------|-------------|--------------|
| **Browse** | Interactive character chart | Click to switch scripts, visual progress indicators |
| **Practice** | Structured exercises | 3 types of practice, adaptive difficulty |
| **Test** | Timed assessments | 20 questions, instant feedback, scoring |
| **Flashcard** | Memory reinforcement | Flip cards, difficulty marking, auto-play |
| **Progress** | Analytics dashboard | Detailed statistics, export capabilities |

### Gamification Elements
- **14 Achievements** with animated unlock notifications
- **10-Level System** with meaningful progression
- **Point System** rewarding consistent practice
- **Streak Tracking** for consecutive correct answers
- **Time Tracking** for study sessions and consecutive days

## 📊 Learning Analytics

The application provides comprehensive learning analytics:

- **Mastery Tracking**: Separate progress for Hiragana and Katakana
- **Performance Metrics**: Accuracy rates, response times, improvement trends
- **Study Habits**: Daily usage patterns, session lengths, consistency metrics
- **Export Options**: JSON data backup and HTML progress reports

## 🎯 Educational Approach

### Spaced Repetition
Characters are presented based on your mastery level, ensuring optimal review timing.

### Progressive Difficulty
Start with basic recognition and advance to complex mixed-script exercises.

### Immediate Feedback
Every interaction provides instant visual and textual feedback to reinforce learning.

### Adaptive Learning
The system adjusts content difficulty based on your performance and progress.

## 🌐 Accessibility & Internationalization

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Multi-language Support**: Interface available in Chinese, English, and Japanese
- **Theme Adaptation**: Automatic dark/light mode based on system preferences

## 🔒 Privacy & Data

- **Local Storage Only**: All data remains on your device
- **No Registration Required**: Start learning immediately without accounts
- **Export/Import**: Full control over your learning data
- **Offline Capable**: Core functionality works without internet connection

## 🤝 Contributing

We welcome contributions to improve this educational platform!

### Ways to Contribute
- 🐛 **Bug Reports**: Found an issue? Please report it
- 💡 **Feature Requests**: Have ideas for improvements?
- 🌍 **Translations**: Help make the app accessible to more learners
- 📚 **Educational Content**: Suggest learning methodology improvements
- 🎨 **UI/UX**: Design and usability enhancements

### Development
This project uses vanilla web technologies for maximum compatibility and performance:
- No build process required
- Direct file editing for quick iterations
- Modern JavaScript features with broad browser support

## 📈 Project Stats

- **14 Achievements** to unlock
- **92 Characters** to master (46 Hiragana + 46 Katakana)
- **5 Learning Modes** for comprehensive practice
- **3 Language Interfaces** (Chinese, English, Japanese)
- **100% Client-side** - no server dependencies

## 🙏 Acknowledgments

- **Font Awesome** for beautiful icons
- **Google Fonts** for Japanese typography support
- **MDN Web Docs** for web standards reference
- **Japanese Language Community** for educational insights

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:
- 📧 Open an issue on GitHub
- 🌟 Star the repository if you find it helpful
- 🔄 Share with other Japanese language learners

---

<div align="center">

**Ready to master Japanese characters?**

[![Start Learning](https://img.shields.io/badge/🚀%20Start%20Learning-Visit%20App-success?style=for-the-badge)](https://haibara406.github.io/Japan-Fifty-Sounds-Learning)

*Join thousands of learners mastering Hiragana and Katakana!*

</div>