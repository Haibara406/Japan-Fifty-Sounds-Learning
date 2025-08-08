// 全局变量
let currentScript = 'hiragana'; // 当前显示的文字类型
let currentMode = 'browse'; // 当前模式
let settings = {
    defaultScript: 'hiragana',
    practiceCount: 20
};

// 学习数据
let userData = {
    level: 1,
    points: 0,
    masteredKanas: new Set(), // 已掌握的假名（包括平假名和片假名）
    learningKanas: new Set(), // 学习中的假名
    practiceStats: {}, // 练习统计：每个假名的答对次数和连续答对次数
    studyTime: 0,
    studyDays: 0,
    lastStudyDate: null,
    accuracy: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    unlockedAchievements: new Set(), // 已解锁的成就
    hasSeenIntro: false, // 是否已看过介绍
    studyDates: [], // 学习日期记录，用于判断连续学习
    currentStreak: 0, // 当前连续答对次数
    maxStreak: 0, // 最大连续答对次数
    perfectTestCount: 0, // 满分测试次数
    modesUsed: new Set() // 使用过的学习模式
};

// 练习模式变量
let practiceData = {
    currentKana: null,
    currentOptions: [],
    correctAnswer: '',
    streak: 0,
    practiceType: 'recognition',
    practiceRange: 'all'
};

// 测试模式变量
let testData = {
    questions: [],
    currentQuestion: 0,
    startTime: null,
    answers: [],
    isActive: false,
    currentTimer: null // 添加当前计时器引用
};

// 记忆卡片变量
let flashcardData = {
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    autoPlay: false,
    autoPlayInterval: null
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadUserData();
    loadSettings();
    setupEventListeners();
    initializeBrowseMode();
    updateUI();

    // 检查是否需要显示介绍
    if (!userData.hasSeenIntro) {
        showIntroModal();
    }

    // 记录学习时间
    setInterval(updateStudyTime, 60000); // 每分钟更新一次
}

// 加载用户数据
function loadUserData() {
    const saved = localStorage.getItem('japaneseKanaUserData');
    if (saved) {
        const parsed = JSON.parse(saved);
        userData = { ...userData, ...parsed };
        userData.masteredKanas = new Set(parsed.masteredKanas || []);
        userData.learningKanas = new Set(parsed.learningKanas || []);
        userData.unlockedAchievements = new Set(parsed.unlockedAchievements || []);
        userData.modesUsed = new Set(parsed.modesUsed || []);
        userData.studyDates = parsed.studyDates || [];
    }

    // 检查是否是新的一天
    const today = new Date().toDateString();
    if (userData.lastStudyDate !== today) {
        userData.studyDays++;
        userData.lastStudyDate = today;

        // 添加到学习日期记录
        if (!userData.studyDates.includes(today)) {
            userData.studyDates.push(today);
            // 只保留最近90天的记录
            if (userData.studyDates.length > 90) {
                userData.studyDates = userData.studyDates.slice(-90);
            }
        }

        saveUserData();
    }
}

// 计算连续学习天数
function getConsecutiveStudyDays() {
    if (userData.studyDates.length === 0) return 0;

    const dates = userData.studyDates.map(dateStr => new Date(dateStr)).sort((a, b) => b - a);
    let consecutiveDays = 1;

    for (let i = 1; i < dates.length; i++) {
        const currentDate = dates[i];
        const previousDate = dates[i - 1];
        const dayDiff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            consecutiveDays++;
        } else {
            break;
        }
    }

    return consecutiveDays;
}

// 保存用户数据
function saveUserData() {
    const dataToSave = {
        ...userData,
        masteredKanas: Array.from(userData.masteredKanas),
        learningKanas: Array.from(userData.learningKanas),
        unlockedAchievements: Array.from(userData.unlockedAchievements),
        modesUsed: Array.from(userData.modesUsed)
    };
    localStorage.setItem('japaneseKanaUserData', JSON.stringify(dataToSave));
}

// 加载设置
function loadSettings() {
    const saved = localStorage.getItem('japaneseKanaSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }
    currentScript = settings.defaultScript;
}

// 保存设置
function saveSettings() {
    localStorage.setItem('japaneseKanaSettings', JSON.stringify(settings));
}

// 设置事件监听器
function setupEventListeners() {
    // 导航按钮
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchMode(this.dataset.mode);
        });
    });
    
    // 浏览模式控件
    document.getElementById('show-hiragana').addEventListener('click', () => switchToScript('hiragana'));
    document.getElementById('show-katakana').addEventListener('click', () => switchToScript('katakana'));

    // 练习模式控件
    document.getElementById('practice-type').addEventListener('change', updatePracticeType);
    document.getElementById('practice-range').addEventListener('change', updatePracticeRange);
    document.getElementById('submit-answer').addEventListener('click', submitAnswer);
    document.getElementById('answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitAnswer();
    });

    // 测试模式控件
    document.getElementById('start-test').addEventListener('click', startTest);
    document.getElementById('stop-test').addEventListener('click', stopTest);
    
    // 记忆卡片控件
    document.getElementById('shuffle-cards').addEventListener('click', shuffleCards);
    document.getElementById('auto-play').addEventListener('click', toggleAutoPlay);
    document.getElementById('prev-card').addEventListener('click', () => navigateCard(-1));
    document.getElementById('next-card').addEventListener('click', () => navigateCard(1));
    document.getElementById('mark-difficult').addEventListener('click', () => markCard('difficult'));
    document.getElementById('mark-easy').addEventListener('click', () => markCard('easy'));
    
    // 设置控件
    setupSettingsListeners();
}





// 切换模式
function switchMode(mode) {
    // 记录使用的模式
    userData.modesUsed.add(mode);
    saveUserData();

    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    // 隐藏所有模式部分
    document.querySelectorAll('.mode-section').forEach(section => {
        section.classList.remove('active');
    });

    // 显示当前模式
    document.getElementById(`${mode}-mode`).classList.add('active');
    currentMode = mode;
    
    // 初始化对应模式
    switch(mode) {
        case 'browse':
            initializeBrowseMode();
            break;
        case 'practice':
            initializePracticeMode();
            break;
        case 'test':
            initializeTestMode();
            break;
        case 'flashcard':
            initializeFlashcardMode();
            break;
        case 'progress':
            initializeProgressMode();
            break;
        case 'achievements':
            initializeAchievementsMode();
            break;
        case 'settings':
            initializeSettingsMode();
            break;
    }
}

// 初始化浏览模式
function initializeBrowseMode() {
    cellDisplayStates.clear(); // 清空显示状态
    renderKanaGrid();
    updateScriptButtons();
}

// 渲染五十音表格
function renderKanaGrid() {
    const grid = document.getElementById('kana-grid');
    grid.innerHTML = '';

    const currentGrid = currentScript === 'hiragana' ? kanaGrid : katakanaGrid;
    const currentRowNames = currentScript === 'hiragana' ? rowNames : katakanaRowNames;

    // 添加表头
    grid.appendChild(createGridHeader(''));
    columnNames.forEach(col => {
        grid.appendChild(createGridHeader(col));
    });

    // 添加行
    currentGrid.forEach((row, rowIndex) => {
        // 行标题
        grid.appendChild(createRowHeader(currentRowNames[rowIndex]));

        // 行内容
        row.forEach((kana, colIndex) => {
            grid.appendChild(createKanaCell(kana, rowIndex, colIndex));
        });
    });
}

// 创建表格头
function createGridHeader(text) {
    const header = document.createElement('div');
    header.className = 'grid-header';
    header.textContent = text;
    return header;
}

// 创建行标题
function createRowHeader(text) {
    const header = document.createElement('div');
    header.className = 'grid-row-header';
    header.textContent = text;
    return header;
}

// 全局变量存储每个卡片的当前显示状态
let cellDisplayStates = new Map(); // 存储每个位置的卡片当前显示的文字类型

// 创建假名单元格
function createKanaCell(kana, rowIndex, colIndex) {
    const cell = document.createElement('div');
    cell.className = 'kana-cell';

    if (!kana) {
        cell.classList.add('empty');
        return cell;
    }

    const cellKey = `${rowIndex}-${colIndex}`;

    // 获取当前脚本下的假名信息
    const kanaInfo = getKanaInfo(kana, currentScript);
    if (!kanaInfo) return cell;

    // 初始化卡片显示状态 - 默认显示当前脚本
    if (!cellDisplayStates.has(cellKey)) {
        cellDisplayStates.set(cellKey, currentScript);
    }

    // 获取当前应该显示的文字
    const displayScript = cellDisplayStates.get(cellKey);
    let displayKana = kana;

    // 如果显示脚本与当前脚本不同，获取对应的假名
    if (displayScript !== currentScript) {
        const correspondingKana = getCorrespondingKana(kana, currentScript, displayScript);
        if (correspondingKana) {
            displayKana = correspondingKana;
        }
    }

    // 添加学习状态类（基于原始假名）
    if (userData.masteredKanas.has(kana)) {
        cell.classList.add('learned');
    } else if (userData.learningKanas.has(kana)) {
        cell.classList.add('learning');
    }

    const kanaChar = document.createElement('div');
    kanaChar.className = 'kana-char';
    kanaChar.textContent = displayKana;

    const romanji = document.createElement('div');
    romanji.className = 'kana-romanji';
    romanji.textContent = kanaInfo.romanji;

    cell.appendChild(kanaChar);
    cell.appendChild(romanji);

    // 添加点击事件 - 切换平假名/片假名并保持状态
    cell.addEventListener('click', function() {
        const currentDisplayScript = cellDisplayStates.get(cellKey);
        const newDisplayScript = currentDisplayScript === 'hiragana' ? 'katakana' : 'hiragana';

        // 获取对应的另一种文字
        const baseKana = currentScript === 'hiragana' ? kana : getCorrespondingKana(kana, currentScript, 'hiragana');
        const correspondingKana = newDisplayScript === 'hiragana' ?
            baseKana :
            getCorrespondingKana(baseKana || kana, 'hiragana', 'katakana');

        if (correspondingKana) {
            // 更新显示状态
            cellDisplayStates.set(cellKey, newDisplayScript);

            // 添加切换动画
            cell.classList.add('flip');
            setTimeout(() => {
                kanaChar.textContent = correspondingKana;
                cell.classList.remove('flip');
            }, 150);
        }

        // 标记为学习中（基于原始假名）
        const originalKana = currentScript === 'hiragana' ? kana : getCorrespondingKana(kana, currentScript, 'hiragana');
        if (originalKana && !userData.masteredKanas.has(originalKana) && !userData.learningKanas.has(originalKana)) {
            userData.learningKanas.add(originalKana);
            cell.classList.add('learning');
            saveUserData();
            updateUI();
        }
    });

    return cell;
}

// 切换到指定文字类型
function switchToScript(script) {
    currentScript = script;

    // 重新渲染整个表格以确保正确显示
    cellDisplayStates.clear();

    // 设置所有卡片为指定的文字类型
    const currentGrid = script === 'hiragana' ? kanaGrid : katakanaGrid;
    currentGrid.forEach((row, rowIndex) => {
        row.forEach((kana, colIndex) => {
            if (kana) {
                const cellKey = `${rowIndex}-${colIndex}`;
                cellDisplayStates.set(cellKey, script);
            }
        });
    });

    // 重新渲染表格
    renderKanaGrid();
    updateScriptButtons();
}

// 更新文字类型按钮状态
function updateScriptButtons() {
    const hiraganaBtn = document.getElementById('show-hiragana');
    const katakanaBtn = document.getElementById('show-katakana');

    hiraganaBtn.classList.toggle('active', currentScript === 'hiragana');
    katakanaBtn.classList.toggle('active', currentScript === 'katakana');
}



// 初始化练习模式
function initializePracticeMode() {
    practiceData.practiceType = document.getElementById('practice-type').value;
    practiceData.practiceRange = document.getElementById('practice-range').value;
    generatePracticeQuestion();
}

// 更新练习类型
function updatePracticeType() {
    practiceData.practiceType = document.getElementById('practice-type').value;
    generatePracticeQuestion();
}

// 更新练习范围
function updatePracticeRange() {
    practiceData.practiceRange = document.getElementById('practice-range').value;
    generatePracticeQuestion();
}

// 生成练习题目
function generatePracticeQuestion() {
    let availableKanas = getKanaData(currentScript).filter(item => item.difficulty < 4);

    // 根据练习范围过滤
    if (practiceData.practiceRange !== 'all') {
        availableKanas = availableKanas.filter(item => item.row === practiceData.practiceRange);
    }

    // 选择当前假名
    practiceData.currentKana = availableKanas[Math.floor(Math.random() * availableKanas.length)];

    // 根据练习类型设置正确答案
    if (practiceData.practiceType === 'recognition') {
        // 识别练习：显示假名，选择罗马音
        document.getElementById('practice-kana').textContent = practiceData.currentKana.kana;
        practiceData.correctAnswer = practiceData.currentKana.romanji;
    } else if (practiceData.practiceType === 'writing') {
        // 书写练习：显示罗马音，输入假名
        document.getElementById('practice-kana').textContent = practiceData.currentKana.romanji;
        practiceData.correctAnswer = practiceData.currentKana.kana;
    } else if (practiceData.practiceType === 'listening') {
        // 听音练习：显示假名，选择罗马音（无音频播放）
        document.getElementById('practice-kana').textContent = practiceData.currentKana.kana;
        practiceData.correctAnswer = practiceData.currentKana.romanji;
    }

    // 根据练习类型生成选项或输入框
    const optionsContainer = document.getElementById('practice-options');
    const inputContainer = document.getElementById('practice-input');
    const feedback = document.getElementById('practice-feedback');

    feedback.textContent = '';
    feedback.className = 'feedback';

    if (practiceData.practiceType === 'recognition' || practiceData.practiceType === 'listening') {
        optionsContainer.style.display = 'grid';
        inputContainer.style.display = 'none';
        generateOptions();
    } else {
        optionsContainer.style.display = 'none';
        inputContainer.style.display = 'flex';
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
    }
}

// 生成选择题选项
function generateOptions() {
    const container = document.getElementById('practice-options');
    container.innerHTML = '';

    // 生成干扰选项
    const similarKanas = getSimilarKanas(practiceData.currentKana.kana, currentScript, 3);
    const options = [practiceData.correctAnswer];

    // 根据练习类型生成选项文本
    similarKanas.forEach(kana => {
        let optionText;
        if (practiceData.practiceType === 'recognition' || practiceData.practiceType === 'listening') {
            // 识别练习和听音练习：选项是罗马音
            optionText = kana.romanji;
        } else {
            // 其他练习类型：选项是假名
            optionText = kana.kana;
        }

        if (!options.includes(optionText)) {
            options.push(optionText);
        }
    });

    // 确保有足够的选项
    while (options.length < 4) {
        const randomKana = getRandomKana(currentScript, true);
        let optionText;
        if (practiceData.practiceType === 'recognition' || practiceData.practiceType === 'listening') {
            optionText = randomKana.romanji;
        } else {
            optionText = randomKana.kana;
        }

        if (!options.includes(optionText)) {
            options.push(optionText);
        }
    }

    // 打乱选项顺序
    options.sort(() => Math.random() - 0.5);
    practiceData.currentOptions = options;

    // 创建选项按钮
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(option));
        container.appendChild(button);
    });
}

// 选择选项
function selectOption(option) {
    checkAnswer(option);
}



// 提交答案
function submitAnswer() {
    const input = document.getElementById('answer-input');
    checkAnswer(input.value.trim().toLowerCase());
}

// 检查答案
function checkAnswer(answer) {
    const isCorrect = answer === practiceData.correctAnswer.toLowerCase();
    const feedback = document.getElementById('practice-feedback');
    const currentKana = practiceData.currentKana.kana;

    // 初始化练习统计
    if (!userData.practiceStats[currentKana]) {
        userData.practiceStats[currentKana] = {
            totalAttempts: 0,
            correctAttempts: 0,
            consecutiveCorrect: 0,
            lastAttemptDate: null
        };
    }

    const stats = userData.practiceStats[currentKana];
    stats.totalAttempts++;
    stats.lastAttemptDate = new Date().toISOString();

    // 更新统计
    userData.totalQuestions++;
    if (isCorrect) {
        userData.correctAnswers++;
        stats.correctAttempts++;
        stats.consecutiveCorrect++;
        practiceData.streak++;

        // 更新连击记录
        userData.currentStreak++;
        if (userData.currentStreak > userData.maxStreak) {
            userData.maxStreak = userData.currentStreak;
        }

        // 判断是否掌握：连续答对3次
        if (stats.consecutiveCorrect >= 3) {
            userData.masteredKanas.add(currentKana);
            userData.learningKanas.delete(currentKana);
            userData.points += 10;
            feedback.textContent = '正确！🎉 已掌握这个假名！';
        } else {
            userData.learningKanas.add(currentKana);
            userData.points += 5;
            feedback.textContent = `正确！连续答对 ${stats.consecutiveCorrect}/3 次`;
        }

        feedback.className = 'feedback correct';
    } else {
        stats.consecutiveCorrect = 0; // 重置连续答对次数
        practiceData.streak = 0;
        userData.currentStreak = 0; // 重置当前连击

        // 如果之前已掌握，降级为学习中
        if (userData.masteredKanas.has(currentKana)) {
            userData.masteredKanas.delete(currentKana);
            userData.learningKanas.add(currentKana);
        } else {
            userData.learningKanas.add(currentKana);
        }

        feedback.textContent = `错误！正确答案是：${practiceData.correctAnswer}`;
        feedback.className = 'feedback incorrect';
    }

    // 更新UI
    userData.accuracy = Math.round((userData.correctAnswers / userData.totalQuestions) * 100);
    updateUI();
    saveUserData();

    // 更新练习统计显示
    updatePracticeStats();

    // 禁用选项按钮
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === practiceData.correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === answer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // 2秒后生成新题目
    setTimeout(generatePracticeQuestion, 2000);
}

// 更新练习统计
function updatePracticeStats() {
    document.getElementById('accuracy-rate').textContent = userData.accuracy + '%';
    document.getElementById('streak').textContent = practiceData.streak;
}

// 初始化测试模式
function initializeTestMode() {
    if (!testData.isActive) {
        showTestInstructions();
    }
}

// 显示测试说明
function showTestInstructions() {
    const content = document.getElementById('test-content');
    content.innerHTML = `
        <div class="test-instructions">
            <h3>测试说明</h3>
            <ul>
                <li>测试包含20道题目</li>
                <li>每题限时10秒</li>
                <li>测试结束后会显示详细报告</li>
                <li>根据表现获得相应积分奖励</li>
            </ul>
        </div>
    `;
}

// 开始测试
function startTest() {
    testData.isActive = true;
    testData.currentQuestion = 0;
    testData.startTime = Date.now();
    testData.answers = [];

    // 生成测试题目
    const availableKanas = getKanaData(currentScript).filter(item => item.difficulty < 4);
    testData.questions = getRandomKanas(20, currentScript, true);

    // 更新按钮状态
    document.getElementById('start-test').style.display = 'none';
    document.getElementById('stop-test').style.display = 'inline-block';

    showTestQuestion();
}

// 停止测试
function stopTest() {
    testData.isActive = false;
    testData.currentQuestion = 0;
    testData.answers = [];

    // 清除当前计时器
    if (testData.currentTimer) {
        clearInterval(testData.currentTimer);
        testData.currentTimer = null;
    }

    // 更新按钮状态
    document.getElementById('start-test').style.display = 'inline-block';
    document.getElementById('stop-test').style.display = 'none';

    // 重置题目计数
    document.getElementById('question-count').textContent = '0/20';

    // 显示测试说明
    showTestInstructions();
}

// 显示测试题目
function showTestQuestion() {
    if (testData.currentQuestion >= testData.questions.length) {
        finishTest();
        return;
    }
    
    const question = testData.questions[testData.currentQuestion];
    const content = document.getElementById('test-content');
    
    content.innerHTML = `
        <div class="practice-card">
            <div class="question-area">
                <div class="kana-display">${question.kana}</div>
            </div>
            <div class="answer-area">
                <div class="options" id="test-options"></div>
            </div>
            <div class="test-timer-display">
                <span>剩余时间: <span id="question-timer">10</span>秒</span>
            </div>
        </div>
    `;
    
    // 生成选项
    generateTestOptions(question);
    
    // 更新题目计数
    document.getElementById('question-count').textContent = `${testData.currentQuestion + 1}/20`;
    
    // 开始计时
    startQuestionTimer();
}

// 生成测试选项
function generateTestOptions(question) {
    const container = document.getElementById('test-options');
    const similarKanas = getSimilarKanas(question.kana, currentScript, 3);
    const options = [question.romanji];
    
    similarKanas.forEach(kana => {
        if (!options.includes(kana.romanji)) {
            options.push(kana.romanji);
        }
    });
    
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => answerTestQuestion(option, button));
        container.appendChild(button);
    });
}

// 回答测试题目
function answerTestQuestion(answer, clickedButton) {
    const question = testData.questions[testData.currentQuestion];
    const isCorrect = answer === question.romanji;

    // 停止当前题目的计时器
    if (testData.currentTimer) {
        clearInterval(testData.currentTimer);
        testData.currentTimer = null;
    }

    // 禁用所有选项按钮
    const allButtons = document.querySelectorAll('#test-options .option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';

        // 显示正确答案
        if (btn.textContent === question.romanji) {
            btn.classList.add('correct');
        }
        // 显示用户选择的错误答案
        else if (btn === clickedButton && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // 显示反馈信息
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `test-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackDiv.textContent = isCorrect ? '正确！' : `错误！正确答案是：${question.romanji}`;

    const questionArea = document.querySelector('#test-content .question-area');
    questionArea.appendChild(feedbackDiv);

    // 记录答题时间（基于停止时的剩余时间）
    const timerElement = document.getElementById('question-timer');
    const timeSpent = timerElement ? 10 - parseInt(timerElement.textContent) : 10;

    testData.answers.push({
        question: question.kana,
        correctAnswer: question.romanji,
        userAnswer: answer,
        isCorrect: isCorrect,
        timeSpent: timeSpent
    });

    testData.currentQuestion++;

    // 3秒后显示下一题或结束测试
    setTimeout(() => {
        if (testData.currentQuestion < testData.questions.length) {
            showTestQuestion();
        } else {
            finishTest();
        }
    }, 3000);
}

// 题目计时器
function startQuestionTimer() {
    let timeLeft = 10;
    const timerElement = document.getElementById('question-timer');

    // 清除之前的计时器
    if (testData.currentTimer) {
        clearInterval(testData.currentTimer);
    }

    testData.currentTimer = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(testData.currentTimer);
            testData.currentTimer = null;
            // 自动提交空答案
            answerTestQuestion('', null);
        }
    }, 1000);
}

// 完成测试
function finishTest() {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - testData.startTime) / 1000);
    const correctCount = testData.answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / testData.answers.length) * 100);
    
    // 计算积分奖励
    let pointsEarned = correctCount * 10;
    if (accuracy >= 90) pointsEarned += 50;
    else if (accuracy >= 80) pointsEarned += 30;
    else if (accuracy >= 70) pointsEarned += 20;
    
    userData.points += pointsEarned;
    userData.totalQuestions += testData.answers.length;
    userData.correctAnswers += correctCount;
    userData.accuracy = Math.round((userData.correctAnswers / userData.totalQuestions) * 100);

    // 检查是否满分
    if (accuracy === 100) {
        userData.perfectTestCount++;
    }

    // 更新等级
    const newLevel = Math.floor(userData.points / 100) + 1;
    if (newLevel > userData.level) {
        userData.level = newLevel;
    }
    
    saveUserData();
    updateUI();
    
    // 显示测试结果
    showTestResults(correctCount, accuracy, totalTime, pointsEarned);

    testData.isActive = false;

    // 重置按钮状态
    document.getElementById('start-test').style.display = 'inline-block';
    document.getElementById('stop-test').style.display = 'none';
}

// 显示测试结果
function showTestResults(correctCount, accuracy, totalTime, pointsEarned) {
    const content = document.getElementById('test-content');
    content.innerHTML = `
        <div class="test-results">
            <h3>测试结果</h3>
            <div class="result-stats">
                <div class="result-item">
                    <span class="result-label">正确题数:</span>
                    <span class="result-value">${correctCount}/20</span>
                </div>
                <div class="result-item">
                    <span class="result-label">准确率:</span>
                    <span class="result-value">${accuracy}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">用时:</span>
                    <span class="result-value">${totalTime}秒</span>
                </div>
                <div class="result-item">
                    <span class="result-label">获得积分:</span>
                    <span class="result-value">+${pointsEarned}</span>
                </div>
            </div>
            <div class="result-actions">
                <button class="control-btn" onclick="initializeTestMode()">重新测试</button>
                <button class="control-btn" onclick="switchMode('progress')">查看进度</button>
            </div>
        </div>
    `;
}

// 初始化记忆卡片模式
function initializeFlashcardMode() {
    flashcardData.cards = getKanaData(currentScript).filter(item => item.difficulty < 4);
    flashcardData.currentIndex = 0;
    flashcardData.isFlipped = false;
    
    updateFlashcard();
    setupFlashcardEvents();
}

// 更新记忆卡片
function updateFlashcard() {
    const card = flashcardData.cards[flashcardData.currentIndex];
    if (!card) return;
    
    document.getElementById('card-kana').textContent = card.kana;
    document.getElementById('card-romanji').textContent = card.romanji;
    document.getElementById('card-meaning').textContent = card.meaning;
    document.getElementById('card-counter').textContent = 
        `${flashcardData.currentIndex + 1}/${flashcardData.cards.length}`;
    
    // 重置翻转状态
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    flashcardData.isFlipped = false;
}

// 设置记忆卡片事件
function setupFlashcardEvents() {
    const flashcard = document.getElementById('flashcard');
    flashcard.addEventListener('click', flipCard);
}

// 翻转卡片
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    flashcardData.isFlipped = !flashcardData.isFlipped;
}

// 导航卡片
function navigateCard(direction) {
    flashcardData.currentIndex += direction;
    
    if (flashcardData.currentIndex < 0) {
        flashcardData.currentIndex = flashcardData.cards.length - 1;
    } else if (flashcardData.currentIndex >= flashcardData.cards.length) {
        flashcardData.currentIndex = 0;
    }
    
    updateFlashcard();
}

// 标记卡片
function markCard(difficulty) {
    const card = flashcardData.cards[flashcardData.currentIndex];
    const currentKana = card.kana;

    // 初始化练习统计
    if (!userData.practiceStats[currentKana]) {
        userData.practiceStats[currentKana] = {
            totalAttempts: 0,
            correctAttempts: 0,
            consecutiveCorrect: 0,
            lastAttemptDate: null
        };
    }

    if (difficulty === 'easy') {
        // 标记为简单 = 直接掌握
        userData.masteredKanas.add(currentKana);
        userData.learningKanas.delete(currentKana);
        userData.practiceStats[currentKana].consecutiveCorrect = 3; // 设为已掌握状态
        userData.points += 5;
    } else {
        // 标记为困难 = 需要更多练习
        userData.learningKanas.add(currentKana);
        userData.practiceStats[currentKana].consecutiveCorrect = 0; // 重置进度

        // 如果之前已掌握，降级为学习中
        if (userData.masteredKanas.has(currentKana)) {
            userData.masteredKanas.delete(currentKana);
        }
    }

    userData.practiceStats[currentKana].lastAttemptDate = new Date().toISOString();

    saveUserData();
    updateUI();

    // 自动切换到下一张
    setTimeout(() => navigateCard(1), 500);
}



// 洗牌卡片
function shuffleCards() {
    flashcardData.cards.sort(() => Math.random() - 0.5);
    flashcardData.currentIndex = 0;
    updateFlashcard();
}

// 切换自动播放
function toggleAutoPlay() {
    flashcardData.autoPlay = !flashcardData.autoPlay;
    const button = document.getElementById('auto-play');
    
    if (flashcardData.autoPlay) {
        button.innerHTML = '<i class="fas fa-pause"></i> 停止自动';
        startAutoPlay();
    } else {
        button.innerHTML = '<i class="fas fa-play"></i> 自动播放';
        stopAutoPlay();
    }
}

// 开始自动播放
function startAutoPlay() {
    flashcardData.autoPlayInterval = setInterval(() => {
        if (!flashcardData.isFlipped) {
            flipCard();
            setTimeout(() => {
                flipCard();
                setTimeout(() => navigateCard(1), 1000);
            }, 2000);
        }
    }, 4000);
}

// 停止自动播放
function stopAutoPlay() {
    if (flashcardData.autoPlayInterval) {
        clearInterval(flashcardData.autoPlayInterval);
        flashcardData.autoPlayInterval = null;
    }
}

// 初始化进度模式
function initializeProgressMode() {
    updateProgressDisplay();
    updateRowProgress();
}

// 切换进度说明显示
function toggleProgressHelp() {
    const helpDiv = document.getElementById('progress-help');
    const button = document.getElementById('show-progress-help');

    if (helpDiv.style.display === 'none') {
        helpDiv.style.display = 'block';
        button.innerHTML = '<i class="fas fa-times"></i> 关闭说明';
    } else {
        helpDiv.style.display = 'none';
        button.innerHTML = '<i class="fas fa-question-circle"></i> 进度说明';
    }
}

// 更新进度显示
function updateProgressDisplay() {
    const hiraganaData = getKanaData('hiragana').filter(item => item.difficulty < 4);
    const katakanaData = getKanaData('katakana').filter(item => item.difficulty < 4);

    // 计算平假名掌握情况
    const hiraganaMastered = hiraganaData.filter(kana => userData.masteredKanas.has(kana.kana)).length;
    const hiraganaProgress = Math.round((hiraganaMastered / hiraganaData.length) * 100);

    // 计算片假名掌握情况
    const katakanaMastered = katakanaData.filter(kana => userData.masteredKanas.has(kana.kana)).length;
    const katakanaProgress = Math.round((katakanaMastered / katakanaData.length) * 100);

    // 计算整体进度
    const totalMastered = hiraganaMastered + katakanaMastered;
    const totalKanas = hiraganaData.length + katakanaData.length;
    const overallProgress = Math.round((totalMastered / totalKanas) * 100);

    // 更新显示
    document.getElementById('overall-progress').textContent = overallProgress + '%';
    document.getElementById('days-studied').textContent = userData.studyDays;
    document.getElementById('time-studied').textContent = Math.round(userData.studyTime / 60);
    document.getElementById('accuracy-overall').textContent = userData.accuracy + '%';
    document.getElementById('mastered-count').textContent = totalMastered;

    // 更新平假名进度
    document.getElementById('hiragana-progress-fill').style.width = hiraganaProgress + '%';
    document.getElementById('hiragana-progress-text').textContent = `${hiraganaMastered}/${hiraganaData.length}`;

    // 更新片假名进度
    document.getElementById('katakana-progress-fill').style.width = katakanaProgress + '%';
    document.getElementById('katakana-progress-text').textContent = `${katakanaMastered}/${katakanaData.length}`;

    // 更新进度圆环
    const progressCircle = document.querySelector('.progress-circle');
    progressCircle.style.background = `conic-gradient(var(--success-color) ${overallProgress * 3.6}deg, var(--bg-tertiary) ${overallProgress * 3.6}deg)`;
}

// 更新各行进度
function updateRowProgress() {
    const container = document.getElementById('row-progress');
    container.innerHTML = '';
    
    const rows = ['a-row', 'ka-row', 'sa-row', 'ta-row', 'na-row', 
                  'ha-row', 'ma-row', 'ya-row', 'ra-row', 'wa-row'];
    const rowDisplayNames = ['あ行', 'か行', 'さ行', 'た行', 'な行', 
                            'は行', 'ま行', 'や行', 'ら行', 'わ行'];
    
    rows.forEach((row, index) => {
        const rowKanas = getKanaByRow(row, currentScript);
        const masteredInRow = rowKanas.filter(kana => userData.masteredKanas.has(kana.kana)).length;
        const progress = Math.round((masteredInRow / rowKanas.length) * 100);
        
        const rowElement = document.createElement('div');
        rowElement.className = 'row-item';
        rowElement.innerHTML = `
            <div class="row-name">${rowDisplayNames[index]}</div>
            <div class="row-progress-bar">
                <div class="row-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="row-percentage">${progress}%</div>
        `;
        
        container.appendChild(rowElement);
    });
}

// 初始化设置模式
function initializeSettingsMode() {
    updateSettingsDisplay();
}

// 更新设置显示
function updateSettingsDisplay() {
    document.getElementById('default-script').value = settings.defaultScript;
    document.getElementById('practice-count').value = settings.practiceCount;
}

// 设置事件监听器
function setupSettingsListeners() {
    // 默认文字
    document.getElementById('default-script').addEventListener('change', function() {
        settings.defaultScript = this.value;
        currentScript = this.value;
        saveSettings();
        if (currentMode === 'browse') {
            renderKanaGrid();
            updateScriptButtons();
        }
    });

    // 练习题数
    document.getElementById('practice-count').addEventListener('change', function() {
        settings.practiceCount = parseInt(this.value);
        saveSettings();
    });

    // 数据管理
    document.getElementById('export-json').addEventListener('click', exportJsonData);
    document.getElementById('export-html').addEventListener('click', exportHtmlReport);
    document.getElementById('import-data').addEventListener('click', importData);
    document.getElementById('reset-progress').addEventListener('click', resetProgress);

    // 进度说明
    document.getElementById('show-progress-help').addEventListener('click', toggleProgressHelp);

    // 积分说明
    document.getElementById('show-level-info').addEventListener('click', showLevelInfoModal);

    // 测试面板
    document.getElementById('toggle-test-panel').addEventListener('click', toggleTestPanel);
    document.getElementById('close-test-panel').addEventListener('click', closeTestPanel);

    // 测试功能事件监听器
    setupTestListeners();
    setupInlineTestListeners();

    // 弹窗关闭
    document.getElementById('close-intro').addEventListener('click', closeIntroModal);
    document.getElementById('close-level-info').addEventListener('click', closeLevelInfoModal);
    document.getElementById('start-learning').addEventListener('click', closeIntroModal);

    // 点击弹窗外部关闭
    window.addEventListener('click', function(event) {
        const introModal = document.getElementById('intro-modal');
        const levelInfoModal = document.getElementById('level-info-modal');
        if (event.target === introModal) {
            closeIntroModal();
        }
        if (event.target === levelInfoModal) {
            closeLevelInfoModal();
        }
    });
}

// 导出JSON数据
function exportJsonData() {
    const jsonData = {
        userData: {
            ...userData,
            masteredKanas: Array.from(userData.masteredKanas),
            learningKanas: Array.from(userData.learningKanas),
            unlockedAchievements: Array.from(userData.unlockedAchievements),
            modesUsed: Array.from(userData.modesUsed)
        },
        settings: settings,
        exportDate: new Date().toISOString(),
        version: '1.0' // 添加版本号用于兼容性
    };

    const jsonStr = JSON.stringify(jsonData, null, 2);
    const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);

    const link = document.createElement('a');
    link.href = jsonUrl;
    link.download = `japanese-kana-backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(jsonUrl);
    alert('JSON数据导出成功！');
}

// 导出HTML报告
function exportHtmlReport() {
    const report = generateLearningReport();
    const htmlContent = generateHTMLReport(report);
    const htmlBlob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' });
    const htmlUrl = URL.createObjectURL(htmlBlob);

    const link = document.createElement('a');
    link.href = htmlUrl;
    link.download = `五十音学习报告_${new Date().toISOString().split('T')[0]}.html`;
    link.click();

    URL.revokeObjectURL(htmlUrl);
    alert('HTML报告导出成功！');
}

// 生成学习报告数据
function generateLearningReport() {
    const totalKanas = getKanaData(currentScript).filter(item => item.difficulty < 4).length;
    const masteredCount = userData.masteredKanas.size;
    const learningCount = userData.learningKanas.size;
    const unlearned = totalKanas - masteredCount - learningCount;
    
    // 按行统计
    const rows = ['a-row', 'ka-row', 'sa-row', 'ta-row', 'na-row', 
                  'ha-row', 'ma-row', 'ya-row', 'ra-row', 'wa-row'];
    const rowNames = ['あ行', 'か行', 'さ行', 'た行', 'な行', 
                     'は行', 'ま行', 'や行', 'ら行', 'わ行'];
    
    const rowProgress = rows.map((row, index) => {
        const rowKanas = getKanaByRow(row, 'hiragana');
        const masteredInRow = rowKanas.filter(kana => userData.masteredKanas.has(kana.kana)).length;
        const learningInRow = rowKanas.filter(kana => userData.learningKanas.has(kana.kana)).length;
        
        return {
            name: rowNames[index],
            total: rowKanas.length,
            mastered: masteredInRow,
            learning: learningInRow,
            unlearned: rowKanas.length - masteredInRow - learningInRow,
            progress: Math.round((masteredInRow / rowKanas.length) * 100)
        };
    });
    
    // 成就统计
    const unlockedAchievements = Array.from(userData.unlockedAchievements).map(id => {
        const achievement = achievementSystem[id];
        return {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon
        };
    });

    return {
        exportDate: new Date().toLocaleString('zh-CN'),
        overall: {
            level: userData.level,
            points: userData.points,
            studyDays: userData.studyDays,
            studyTime: Math.round(userData.studyTime / 60), // 转换为小时
            totalQuestions: userData.totalQuestions,
            correctAnswers: userData.correctAnswers,
            accuracy: userData.accuracy,
            totalKanas: totalKanas,
            masteredCount: masteredCount,
            learningCount: learningCount,
            unlearnedCount: unlearned,
            masteryRate: Math.round((masteredCount / totalKanas) * 100),
            consecutiveStudyDays: getConsecutiveStudyDays(),
            maxStreak: userData.maxStreak,
            perfectTestCount: userData.perfectTestCount
        },
        rowProgress: rowProgress,
        masteredKanas: Array.from(userData.masteredKanas),
        learningKanas: Array.from(userData.learningKanas),
        achievements: {
            unlocked: unlockedAchievements,
            totalCount: Object.keys(achievementSystem).length,
            unlockedCount: userData.unlockedAchievements.size
        }
    };
}

// 生成HTML报告
function generateHTMLReport(report) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>五十音学习报告</title>
    <style>
        body { font-family: 'Arial', 'Microsoft YaHei', sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #4A90E2; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #4A90E2; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-left: 4px solid #4A90E2; padding-left: 10px; margin-bottom: 15px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef; }
        .stat-number { font-size: 2em; font-weight: bold; color: #4A90E2; }
        .stat-label { color: #666; font-size: 0.9em; margin-top: 5px; }
        .progress-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .progress-table th, .progress-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .progress-table th { background-color: #f8f9fa; color: #333; font-weight: bold; }
        .progress-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; margin: 5px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4ECDC4, #4A90E2); transition: width 0.3s; border-radius: 10px; }
        .kana-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px; margin-top: 15px; }
        .kana-item { background: #4ECDC4; color: white; padding: 10px; text-align: center; border-radius: 5px; font-weight: bold; }
        .kana-item.learning { background: #FFE66D; color: #333; }
        .achievement { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌸 五十音学习报告 🌸</h1>
            <p>导出时间：${report.exportDate}</p>
            <p>学习等级：${report.overall.level} 级 | 总积分：${report.overall.points} 分</p>
        </div>

        <div class="section">
            <h2>📊 整体学习情况</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${report.overall.masteryRate}%</div>
                    <div class="stat-label">整体掌握度</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.studyDays}</div>
                    <div class="stat-label">学习天数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.studyTime}</div>
                    <div class="stat-label">学习小时数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.accuracy}%</div>
                    <div class="stat-label">答题准确率</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>📈 学习进度详情</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${report.overall.masteredCount}</div>
                    <div class="stat-label">已掌握假名</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.learningCount}</div>
                    <div class="stat-label">学习中假名</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.unlearnedCount}</div>
                    <div class="stat-label">未学习假名</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.totalQuestions}</div>
                    <div class="stat-label">练习题总数</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>📝 各行学习情况</h2>
            <table class="progress-table">
                <thead>
                    <tr>
                        <th>行</th>
                        <th>进度</th>
                        <th>已掌握</th>
                        <th>学习中</th>
                        <th>未学习</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.rowProgress.map(row => `
                        <tr>
                            <td><strong>${row.name}</strong></td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${row.progress}%"></div>
                                </div>
                                ${row.progress}%
                            </td>
                            <td>${row.mastered}/${row.total}</td>
                            <td>${row.learning}</td>
                            <td>${row.unlearned}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>✅ 已掌握的假名</h2>
            <div class="kana-grid">
                ${report.masteredKanas.map(kana => `<div class="kana-item">${kana}</div>`).join('')}
            </div>
        </div>

        <div class="section">
            <h2>📚 学习中的假名</h2>
            <div class="kana-grid">
                ${report.learningKanas.map(kana => `<div class="kana-item learning">${kana}</div>`).join('')}
            </div>
        </div>

        <div class="section">
            <h2>🏆 成就系统</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${report.achievements.unlockedCount}</div>
                    <div class="stat-label">已解锁成就</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.achievements.totalCount}</div>
                    <div class="stat-label">总成就数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.consecutiveStudyDays}</div>
                    <div class="stat-label">连续学习天数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${report.overall.maxStreak}</div>
                    <div class="stat-label">最大连击数</div>
                </div>
            </div>

            ${report.achievements.unlocked.length > 0 ? `
                <h3>🎖️ 已解锁的成就</h3>
                ${report.achievements.unlocked.map(achievement => `
                    <div class="achievement">
                        <i class="${achievement.icon}"></i>
                        <strong>${achievement.name}</strong> - ${achievement.description}
                    </div>
                `).join('')}
            ` : '<p>还没有解锁任何成就，继续努力学习吧！</p>'}
        </div>

        <div class="footer">
            <p>📱 生成自：五十音学习网站</p>
            <p>💡 继续保持学习，早日掌握全部五十音！</p>
        </div>
    </div>
</body>
</html>`;
}

// 导入数据
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.userData) {
                    userData = { ...userData, ...data.userData };
                    userData.masteredKanas = new Set(data.userData.masteredKanas || []);
                    userData.learningKanas = new Set(data.userData.learningKanas || []);
                    userData.unlockedAchievements = new Set(data.userData.unlockedAchievements || []);
                    userData.modesUsed = new Set(data.userData.modesUsed || []);
                    userData.studyDates = data.userData.studyDates || [];

                    // 确保新字段有默认值
                    userData.currentStreak = userData.currentStreak || 0;
                    userData.maxStreak = userData.maxStreak || 0;
                    userData.perfectTestCount = userData.perfectTestCount || 0;
                    userData.hasSeenIntro = userData.hasSeenIntro !== undefined ? userData.hasSeenIntro : false;

                    saveUserData();
                }
                
                if (data.settings) {
                    settings = { ...settings, ...data.settings };
                    saveSettings();
                    updateSettingsDisplay();
                }
                
                updateUI();
                alert('数据导入成功！');
                
            } catch (error) {
                alert('数据格式错误，导入失败！');
            }
        };
        
        reader.readAsText(file);
    });
    
    input.click();
}

// 重置进度
function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可撤销！')) {
        userData = {
            level: 1,
            points: 0,
            masteredKanas: new Set(),
            learningKanas: new Set(),
            practiceStats: {},
            studyTime: 0,
            studyDays: 0,
            lastStudyDate: null,
            accuracy: 0,
            totalQuestions: 0,
            correctAnswers: 0
        };
        
        saveUserData();
        updateUI();
        alert('学习进度已重置！');
    }
}

// 更新学习时间
function updateStudyTime() {
    userData.studyTime += 1; // 增加1分钟
    saveUserData();
    
    if (currentMode === 'progress') {
        document.getElementById('time-studied').textContent = Math.round(userData.studyTime / 60);
    }
}

// 等级系统配置
const levelSystem = {
    1: { pointsRequired: 0, benefits: ['开始学习之旅'] },
    2: { pointsRequired: 100, benefits: ['练习新手'] },
    3: { pointsRequired: 300, benefits: ['测试挑战者'] },
    4: { pointsRequired: 600, benefits: ['记忆达人'] },
    5: { pointsRequired: 1000, benefits: ['进步追踪者'] },
    6: { pointsRequired: 1500, benefits: ['数据管理员'] },
    7: { pointsRequired: 2100, benefits: ['学习分析师'] },
    8: { pointsRequired: 2800, benefits: ['个性化专家'] },
    9: { pointsRequired: 3600, benefits: ['成就收集家'] },
    10: { pointsRequired: 4500, benefits: ['五十音大师！'] }
};

// 成就系统配置
const achievementSystem = {
    'first_step': {
        id: 'first_step',
        name: '初次尝试',
        description: '完成第一次练习',
        icon: 'fas fa-baby',
        condition: () => userData.totalQuestions >= 1
    },
    'practice_master': {
        id: 'practice_master',
        name: '练习达人',
        description: '完成100道练习题',
        icon: 'fas fa-dumbbell',
        condition: () => userData.totalQuestions >= 10 // 测试版：降低到10题
    },
    'accuracy_expert': {
        id: 'accuracy_expert',
        name: '精准射手',
        description: '达到90%以上准确率',
        icon: 'fas fa-bullseye',
        condition: () => userData.accuracy >= 90 && userData.totalQuestions >= 5 // 测试版：降低到5题
    },
    'speed_demon': {
        id: 'speed_demon',
        name: '速度恶魔',
        description: '在测试中获得满分',
        icon: 'fas fa-rocket',
        condition: () => false // 需要在测试完成时检查
    },
    'hiragana_master': {
        id: 'hiragana_master',
        name: '平假名大师',
        description: '掌握所有基础平假名',
        icon: 'fas fa-graduation-cap',
        condition: () => {
            const hiraganaData = getKanaData('hiragana').filter(item => item.difficulty < 4);
            return hiraganaData.every(kana => userData.masteredKanas.has(kana.kana));
        }
    },
    'katakana_master': {
        id: 'katakana_master',
        name: '片假名大师',
        description: '掌握所有基础片假名',
        icon: 'fas fa-crown',
        condition: () => {
            const katakanaData = getKanaData('katakana').filter(item => item.difficulty < 4);
            return katakanaData.every(kana => userData.masteredKanas.has(kana.kana));
        }
    },
    'persistent_learner': {
        id: 'persistent_learner',
        name: '坚持不懈',
        description: '连续学习7天',
        icon: 'fas fa-calendar-check',
        condition: () => getConsecutiveStudyDays() >= 3 // 测试版：降低到3天
    },
    'time_master': {
        id: 'time_master',
        name: '时间管理大师',
        description: '累计学习10小时',
        icon: 'fas fa-clock',
        condition: () => userData.studyTime >= 10 // 测试版：降低到10分钟
    },
    'perfectionist': {
        id: 'perfectionist',
        name: '完美主义者',
        description: '连续答对50题',
        icon: 'fas fa-gem',
        condition: () => userData.maxStreak >= 5 // 测试版：降低到5题
    },
    'explorer': {
        id: 'explorer',
        name: '探索者',
        description: '尝试所有学习模式',
        icon: 'fas fa-compass',
        condition: () => userData.modesUsed.size >= 3 // 测试版：降低到3个模式
    },
    'level_5': {
        id: 'level_5',
        name: '进步追踪者',
        description: '达到5级',
        icon: 'fas fa-star',
        condition: () => userData.level >= 3 // 测试版：降低到3级
    },
    'level_10': {
        id: 'level_10',
        name: '五十音大师',
        description: '达到10级（最高级）',
        icon: 'fas fa-trophy',
        condition: () => userData.level >= 5 // 测试版：降低到5级
    },
    'speed_learner': {
        id: 'speed_learner',
        name: '速度学习者',
        description: '单日学习超过2小时',
        icon: 'fas fa-tachometer-alt',
        condition: () => false // 需要追踪单日学习时间
    },
    'perfect_test': {
        id: 'perfect_test',
        name: '测试专家',
        description: '获得3次满分测试',
        icon: 'fas fa-medal',
        condition: () => userData.perfectTestCount >= 3
    },
    'dedication': {
        id: 'dedication',
        name: '学习狂人',
        description: '连续学习30天',
        icon: 'fas fa-fire',
        condition: () => getConsecutiveStudyDays() >= 30
    },
    'marathon': {
        id: 'marathon',
        name: '学习马拉松',
        description: '累计学习50小时',
        icon: 'fas fa-running',
        condition: () => userData.studyTime >= 3000 // 50小时 = 3000分钟
    }
};

// 检查等级提升
function checkLevelUp() {
    const currentLevel = userData.level;
    let newLevel = currentLevel;

    // 计算新等级
    for (let level = currentLevel + 1; level <= 10; level++) {
        if (userData.points >= levelSystem[level].pointsRequired) {
            newLevel = level;
        } else {
            break;
        }
    }

    // 如果等级提升了
    if (newLevel > currentLevel) {
        userData.level = newLevel;
        showLevelUpNotification(newLevel);
        return true;
    }

    return false;
}

// 显示等级提升通知
function showLevelUpNotification(newLevel) {
    const benefitElement = document.getElementById('level-benefits');
    const benefitText = document.getElementById('level-benefit-text');

    benefitText.textContent = `🎉 升级到 ${newLevel} 级！${levelSystem[newLevel].benefits.join('、')}`;
    benefitElement.style.display = 'flex';
    benefitElement.classList.add('level-up-animation');

    // 3秒后隐藏
    setTimeout(() => {
        benefitElement.style.display = 'none';
        benefitElement.classList.remove('level-up-animation');
    }, 3000);
}

// 更新UI显示
function updateUI() {
    // 检查等级提升
    checkLevelUp();

    // 检查成就解锁
    checkAchievements();

    // 更新用户状态
    document.getElementById('user-level').textContent = userData.level;
    document.getElementById('user-points').textContent = userData.points;

    // 更新测试信息显示
    document.getElementById('test-questions').textContent = userData.totalQuestions;
    document.getElementById('test-streak').textContent = userData.maxStreak;
    document.getElementById('test-achievements').textContent = `${userData.unlockedAchievements.size}/${Object.keys(achievementSystem).length}`;

    // 计算掌握度（包括平假名和片假名）
    const hiraganaData = getKanaData('hiragana').filter(item => item.difficulty < 4);
    const katakanaData = getKanaData('katakana').filter(item => item.difficulty < 4);
    const totalKanas = hiraganaData.length + katakanaData.length;

    // 计算已掌握的假名数量（平假名和片假名分别计算）
    let masteredCount = 0;
    hiraganaData.forEach(kana => {
        if (userData.masteredKanas.has(kana.kana)) masteredCount++;
    });
    katakanaData.forEach(kana => {
        if (userData.masteredKanas.has(kana.kana)) masteredCount++;
    });

    const masteryRate = Math.round((masteredCount / totalKanas) * 100);
    document.getElementById('mastery-rate').textContent = masteryRate + '%';

    // 更新练习统计
    if (currentMode === 'practice') {
        updatePracticeStats();
    }

    // 更新进度页面
    if (currentMode === 'progress') {
        updateProgressDisplay();
        updateRowProgress();
    }

    // 更新成就页面
    if (currentMode === 'achievements') {
        renderAchievements();
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (currentMode === 'practice') {
        // 数字键1-4选择选项
        if (e.code.startsWith('Digit') && (practiceData.practiceType === 'recognition' || practiceData.practiceType === 'listening')) {
            const digit = parseInt(e.code.slice(-1));
            if (digit >= 1 && digit <= 4) {
                const options = document.querySelectorAll('.option-btn');
                if (options[digit - 1]) {
                    options[digit - 1].click();
                }
            }
        }
    }

    if (currentMode === 'flashcard') {
        // 左右箭头导航
        if (e.code === 'ArrowLeft') {
            navigateCard(-1);
        } else if (e.code === 'ArrowRight') {
            navigateCard(1);
        }
        // 空格键翻转
        else if (e.code === 'Space') {
            e.preventDefault();
            flipCard();
        }
    }
});

// 检查成就解锁
function checkAchievements() {
    let newAchievements = [];

    Object.values(achievementSystem).forEach(achievement => {
        if (!userData.unlockedAchievements.has(achievement.id) && achievement.condition()) {
            userData.unlockedAchievements.add(achievement.id);
            newAchievements.push(achievement);
        }
    });

    // 显示新解锁的成就
    newAchievements.forEach(achievement => {
        showAchievementNotification(achievement);
    });

    if (newAchievements.length > 0) {
        saveUserData();
    }
}

// 显示成就解锁通知
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <i class="${achievement.icon}"></i>
            <div>
                <div class="achievement-notification-title">成就解锁！</div>
                <div class="achievement-notification-name">${achievement.name}</div>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // 3秒后移除通知
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 初始化成就模式
function initializeAchievementsMode() {
    renderAchievements();
}

// 渲染成就列表
function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    const unlockedCount = userData.unlockedAchievements.size;
    const totalCount = Object.keys(achievementSystem).length;

    document.getElementById('unlocked-count').textContent = unlockedCount;
    document.getElementById('total-achievements').textContent = totalCount;

    Object.values(achievementSystem).forEach(achievement => {
        const isUnlocked = userData.unlockedAchievements.has(achievement.id);

        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

        card.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-name">
                ${isUnlocked ? achievement.name : '???'}
            </div>
            <div class="achievement-description">
                ${isUnlocked ? achievement.description : '暂未解锁此成就'}
            </div>
            ${isUnlocked ? '<div class="achievement-unlock-badge">已解锁</div>' : ''}
        `;

        grid.appendChild(card);
    });
}

// 显示介绍弹窗
function showIntroModal() {
    document.getElementById('intro-modal').style.display = 'block';
}

// 关闭介绍弹窗
function closeIntroModal() {
    document.getElementById('intro-modal').style.display = 'none';
    userData.hasSeenIntro = true;
    saveUserData();
}

// 显示积分说明弹窗
function showLevelInfoModal() {
    const modal = document.getElementById('level-info-modal');
    const levelsList = document.getElementById('levels-list');

    // 生成等级列表
    levelsList.innerHTML = '';
    Object.entries(levelSystem).forEach(([level, data]) => {
        const item = document.createElement('div');
        item.className = `level-item ${userData.level == level ? 'current' : ''}`;
        item.innerHTML = `
            <span class="level-name">Lv.${level} ${data.benefits[0]}</span>
            <span class="level-points">${data.pointsRequired}分</span>
        `;
        levelsList.appendChild(item);
    });

    modal.style.display = 'block';
}

// 关闭积分说明弹窗
function closeLevelInfoModal() {
    document.getElementById('level-info-modal').style.display = 'none';
}

// ========== 测试功能 ==========

// 切换测试面板
function toggleTestPanel() {
    const panel = document.getElementById('test-panel');
    panel.classList.toggle('active');
}

// 关闭测试面板
function closeTestPanel() {
    const panel = document.getElementById('test-panel');
    panel.classList.remove('active');
}

// 设置测试功能事件监听器
function setupTestListeners() {
    // 积分测试
    document.getElementById('add-points-100').addEventListener('click', () => addTestPoints(100));
    document.getElementById('add-points-500').addEventListener('click', () => addTestPoints(500));
    document.getElementById('add-points-1000').addEventListener('click', () => addTestPoints(1000));
    document.getElementById('reset-points').addEventListener('click', resetTestPoints);

    // 成就测试
    document.getElementById('unlock-first-step').addEventListener('click', () => unlockTestAchievement('first_step'));
    document.getElementById('unlock-practice-master').addEventListener('click', () => unlockTestAchievement('practice_master'));
    document.getElementById('unlock-accuracy-expert').addEventListener('click', () => unlockTestAchievement('accuracy_expert'));
    document.getElementById('unlock-hiragana-master').addEventListener('click', () => unlockTestAchievement('hiragana_master'));
    document.getElementById('unlock-level-achievements').addEventListener('click', unlockLevelAchievements);
    document.getElementById('unlock-all-achievements').addEventListener('click', unlockAllAchievements);
    document.getElementById('reset-achievements').addEventListener('click', resetTestAchievements);

    // 时间测试
    document.getElementById('add-study-time').addEventListener('click', addTestStudyTime);
    document.getElementById('add-consecutive-days').addEventListener('click', () => addTestConsecutiveDays(7));
    document.getElementById('add-long-streak').addEventListener('click', () => addTestConsecutiveDays(30));
    document.getElementById('reset-time-data').addEventListener('click', resetTestTimeData);

    // 统计测试
    document.getElementById('add-practice-stats').addEventListener('click', addTestPracticeStats);
    document.getElementById('add-perfect-tests').addEventListener('click', addTestPerfectTests);
    document.getElementById('add-max-streak').addEventListener('click', addTestMaxStreak);
    document.getElementById('master-all-hiragana').addEventListener('click', masterAllHiragana);
    document.getElementById('master-all-katakana').addEventListener('click', masterAllKatakana);

    // 系统测试
    document.getElementById('trigger-level-up').addEventListener('click', triggerLevelUpCheck);
    document.getElementById('trigger-achievement-check').addEventListener('click', triggerAchievementCheck);
    document.getElementById('show-test-notification').addEventListener('click', showTestNotification);
    document.getElementById('reset-all-data').addEventListener('click', resetAllTestData);
}

// 添加测试积分
function addTestPoints(points) {
    userData.points += points;
    saveUserData();
    updateUI();
    alert(`已添加 ${points} 积分！当前积分：${userData.points}`);
}

// 重置积分
function resetTestPoints() {
    userData.points = 0;
    userData.level = 1;
    saveUserData();
    updateUI();
    alert('积分和等级已重置！');
}

// 解锁指定成就
function unlockTestAchievement(achievementId) {
    if (achievementSystem[achievementId]) {
        userData.unlockedAchievements.add(achievementId);
        saveUserData();
        showAchievementNotification(achievementSystem[achievementId]);
        updateUI();
        alert(`已解锁成就：${achievementSystem[achievementId].name}`);
    }
}

// 解锁等级成就
function unlockLevelAchievements() {
    userData.points = 1000; // 设置足够的积分
    userData.level = 10;    // 设置最高等级
    userData.unlockedAchievements.add('level_5');
    userData.unlockedAchievements.add('level_10');
    saveUserData();
    updateUI();
    alert('已解锁所有等级成就！');
}

// 解锁所有成就
function unlockAllAchievements() {
    Object.keys(achievementSystem).forEach(id => {
        userData.unlockedAchievements.add(id);
    });
    saveUserData();
    updateUI();
    alert(`已解锁所有 ${Object.keys(achievementSystem).length} 个成就！`);
}

// 重置成就
function resetTestAchievements() {
    userData.unlockedAchievements.clear();
    saveUserData();
    updateUI();
    alert('所有成就已重置！');
}

// 添加测试学习时长
function addTestStudyTime() {
    userData.studyTime += 600; // 添加10小时（600分钟）
    saveUserData();
    updateUI();
    alert(`已添加10小时学习时长！总时长：${Math.round(userData.studyTime / 60)}小时`);
}

// 添加测试连续学习天数
function addTestConsecutiveDays(days) {
    const today = new Date();
    userData.studyDates = [];

    // 生成连续的学习日期
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        userData.studyDates.push(date.toDateString());
    }

    userData.studyDays = days;
    userData.lastStudyDate = today.toDateString();
    saveUserData();
    updateUI();
    alert(`已模拟连续学习${days}天！`);
}

// 重置时间数据
function resetTestTimeData() {
    userData.studyTime = 0;
    userData.studyDays = 0;
    userData.studyDates = [];
    userData.lastStudyDate = null;
    saveUserData();
    updateUI();
    alert('时间数据已重置！');
}

// 添加测试练习统计
function addTestPracticeStats() {
    userData.totalQuestions += 100;
    userData.correctAnswers += 90; // 90%准确率
    userData.accuracy = Math.round((userData.correctAnswers / userData.totalQuestions) * 100);
    saveUserData();
    updateUI();
    alert('已添加100道练习题（90%准确率）！');
}

// 添加测试满分次数
function addTestPerfectTests() {
    userData.perfectTestCount += 3;
    saveUserData();
    updateUI();
    alert('已添加3次满分测试记录！');
}

// 设置最大连击
function addTestMaxStreak() {
    userData.maxStreak = 50;
    userData.currentStreak = 50;
    saveUserData();
    updateUI();
    alert('已设置50连击记录！');
}

// 掌握所有平假名
function masterAllHiragana() {
    const hiraganaData = getKanaData('hiragana').filter(item => item.difficulty < 4);
    hiraganaData.forEach(kana => {
        userData.masteredKanas.add(kana.kana);
        userData.learningKanas.delete(kana.kana);
    });
    saveUserData();
    updateUI();
    alert(`已掌握所有${hiraganaData.length}个平假名！`);
}

// 掌握所有片假名
function masterAllKatakana() {
    const katakanaData = getKanaData('katakana').filter(item => item.difficulty < 4);
    katakanaData.forEach(kana => {
        userData.masteredKanas.add(kana.kana);
        userData.learningKanas.delete(kana.kana);
    });
    saveUserData();
    updateUI();
    alert(`已掌握所有${katakanaData.length}个片假名！`);
}

// 触发升级检查
function triggerLevelUpCheck() {
    const oldLevel = userData.level;
    checkLevelUp();
    updateUI();
    alert(`等级检查完成！当前等级：${userData.level}（之前：${oldLevel}）`);
}

// 触发成就检查
function triggerAchievementCheck() {
    const oldCount = userData.unlockedAchievements.size;
    checkAchievements();
    updateUI();
    const newCount = userData.unlockedAchievements.size;
    alert(`成就检查完成！解锁成就：${newCount}/${Object.keys(achievementSystem).length}（新增：${newCount - oldCount}）`);
}

// 显示测试通知
function showTestNotification() {
    const testAchievement = {
        name: '测试成就',
        icon: 'fas fa-bug'
    };
    showAchievementNotification(testAchievement);
    alert('测试通知已显示！');
}

// 重置所有数据
function resetAllTestData() {
    if (confirm('确定要重置所有测试数据吗？这将清除所有进度！')) {
        userData = {
            level: 1,
            points: 0,
            masteredKanas: new Set(),
            learningKanas: new Set(),
            practiceStats: {},
            studyTime: 0,
            studyDays: 0,
            lastStudyDate: null,
            accuracy: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            unlockedAchievements: new Set(),
            hasSeenIntro: true, // 保持已看过介绍的状态
            studyDates: [],
            currentStreak: 0,
            maxStreak: 0,
            perfectTestCount: 0,
            modesUsed: new Set()
        };
        saveUserData();
        updateUI();
        alert('所有数据已重置！');
    }
}

// ========== 内联测试功能 ==========

// 设置内联测试功能事件监听器
function setupInlineTestListeners() {
    // 浏览模式测试功能
    document.getElementById('test-master-random').addEventListener('click', testMasterRandomKanas);
    document.getElementById('test-clear-progress').addEventListener('click', testClearProgress);

    // 练习模式测试功能
    document.getElementById('test-auto-correct').addEventListener('click', testAutoCorrect);
    document.getElementById('test-auto-wrong').addEventListener('click', testAutoWrong);
    document.getElementById('test-add-streak').addEventListener('click', testAddStreak);

    // 测试模式测试功能
    document.getElementById('test-perfect-score').addEventListener('click', testPerfectScore);
    document.getElementById('test-skip-timer').addEventListener('click', testSkipTimer);
}

// 随机掌握5个假名
function testMasterRandomKanas() {
    const currentData = getKanaData(currentScript).filter(item =>
        item.difficulty < 4 && !userData.masteredKanas.has(item.kana)
    );

    if (currentData.length === 0) {
        alert('当前文字类型的所有假名都已掌握！');
        return;
    }

    const count = Math.min(5, currentData.length);
    const randomKanas = currentData.sort(() => 0.5 - Math.random()).slice(0, count);

    randomKanas.forEach(kana => {
        userData.masteredKanas.add(kana.kana);
        userData.learningKanas.delete(kana.kana);
    });

    userData.points += count * 10; // 每个掌握的假名+10分
    saveUserData();
    updateUI();
    renderKanaGrid(); // 重新渲染表格显示变化

    alert(`已随机掌握${count}个${currentScript === 'hiragana' ? '平假名' : '片假名'}！`);
}

// 清空当前文字类型的学习进度
function testClearProgress() {
    const currentData = getKanaData(currentScript).filter(item => item.difficulty < 4);
    let clearedCount = 0;

    currentData.forEach(kana => {
        if (userData.masteredKanas.has(kana.kana) || userData.learningKanas.has(kana.kana)) {
            userData.masteredKanas.delete(kana.kana);
            userData.learningKanas.delete(kana.kana);
            clearedCount++;
        }
    });

    saveUserData();
    updateUI();
    renderKanaGrid();

    alert(`已清空${clearedCount}个${currentScript === 'hiragana' ? '平假名' : '片假名'}的学习进度！`);
}

// 自动答对当前练习题
function testAutoCorrect() {
    if (currentMode !== 'practice' || !practiceData.currentKana) {
        alert('请先开始练习！');
        return;
    }

    // 模拟正确答案
    const correctAnswer = practiceData.correctAnswer;

    if (practiceData.practiceType === 'recognition' || practiceData.practiceType === 'listening') {
        // 选择题模式：自动点击正确选项
        const options = document.querySelectorAll('.option-btn');
        const correctOption = Array.from(options).find(btn => btn.textContent === correctAnswer);
        if (correctOption) {
            correctOption.click();
        }
    } else {
        // 输入题模式：自动填入正确答案
        const input = document.getElementById('answer-input');
        if (input) {
            input.value = correctAnswer;
            submitAnswer();
        }
    }
}

// 自动答错当前练习题
function testAutoWrong() {
    if (currentMode !== 'practice' || !practiceData.currentKana) {
        alert('请先开始练习！');
        return;
    }

    if (practiceData.practiceType === 'recognition' || practiceData.practiceType === 'listening') {
        // 选择题模式：点击错误选项
        const options = document.querySelectorAll('.option-btn');
        const wrongOption = Array.from(options).find(btn => btn.textContent !== practiceData.correctAnswer);
        if (wrongOption) {
            wrongOption.click();
        }
    } else {
        // 输入题模式：输入错误答案
        const input = document.getElementById('answer-input');
        if (input) {
            input.value = 'wrong_answer';
            submitAnswer();
        }
    }
}

// 增加5连击
function testAddStreak() {
    userData.currentStreak += 5;
    userData.maxStreak = Math.max(userData.maxStreak, userData.currentStreak);
    saveUserData();
    updateUI();
    alert(`已增加5连击！当前连击：${userData.currentStreak}`);
}

// 模拟满分测试
function testPerfectScore() {
    if (!testData.isActive) {
        alert('请先开始测试！');
        return;
    }

    // 直接结束测试并设置满分
    testData.answers = [];
    for (let i = 0; i < 20; i++) {
        testData.answers.push({
            question: 'test',
            correctAnswer: 'test',
            userAnswer: 'test',
            isCorrect: true,
            timeSpent: 1
        });
    }

    testData.currentQuestion = 20;
    finishTest();
    alert('已模拟满分测试完成！');
}

// 跳过当前题目计时
function testSkipTimer() {
    if (!testData.isActive || !testData.currentTimer) {
        alert('当前没有进行中的测试题目！');
        return;
    }

    // 清除计时器并自动提交
    clearInterval(testData.currentTimer);
    testData.currentTimer = null;

    // 自动选择正确答案
    const question = testData.questions[testData.currentQuestion];
    answerTestQuestion(question.romanji, null);

    alert('已跳过计时并自动答对！');
}

// 显示测试版本信息
function showTestVersionInfo() {
    const info = `
🧪 内部测试版本 v1.0

📋 测试功能清单：
✅ 积分与等级系统
✅ 成就系统 (14个成就)
✅ 学习进度追踪
✅ 时间统计 (连续天数/累计时长)
✅ 数据导出/导入
✅ 响应式设计
✅ 多模式学习

🔧 测试工具：
• 右上角测试面板 (完整功能测试)
• 各模式内联测试按钮 (快速测试)
• 降低成就门槛 (便于测试)
• 实时数据显示

⚠️ 注意事项：
• 这是内部测试版本，包含调试功能
• 成就门槛已降低便于测试
• 所有数据保存在本地存储
• 可随时重置测试数据

🎯 测试重点：
1. 成就解锁机制
2. 积分等级提升
3. 学习进度记录
4. 数据导出完整性
5. 界面响应性
    `;

    alert(info);
}

// 在页面加载完成后显示测试版本信息
document.addEventListener('DOMContentLoaded', function() {
    // 延迟显示，确保页面完全加载
    setTimeout(() => {
        if (confirm('🧪 欢迎使用内部测试版本！\n\n是否查看测试功能说明？')) {
            showTestVersionInfo();
        }
    }, 1000);
});

// 页面可见性变化时暂停自动播放
document.addEventListener('visibilitychange', function() {
    if (document.hidden && flashcardData.autoPlay) {
        stopAutoPlay();
    }
});