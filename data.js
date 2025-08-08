// 五十音数据
const kanaData = {
    // 平假名数据
    hiragana: [
        // あ行
        { kana: 'あ', romanji: 'a', row: 'a-row', meaning: '元音A', difficulty: 1 },
        { kana: 'い', romanji: 'i', row: 'a-row', meaning: '元音I', difficulty: 1 },
        { kana: 'う', romanji: 'u', row: 'a-row', meaning: '元音U', difficulty: 1 },
        { kana: 'え', romanji: 'e', row: 'a-row', meaning: '元音E', difficulty: 1 },
        { kana: 'お', romanji: 'o', row: 'a-row', meaning: '元音O', difficulty: 1 },
        
        // か行
        { kana: 'か', romanji: 'ka', row: 'ka-row', meaning: 'K+A音', difficulty: 2 },
        { kana: 'き', romanji: 'ki', row: 'ka-row', meaning: 'K+I音', difficulty: 2 },
        { kana: 'く', romanji: 'ku', row: 'ka-row', meaning: 'K+U音', difficulty: 2 },
        { kana: 'け', romanji: 'ke', row: 'ka-row', meaning: 'K+E音', difficulty: 2 },
        { kana: 'こ', romanji: 'ko', row: 'ka-row', meaning: 'K+O音', difficulty: 2 },
        
        // さ行
        { kana: 'さ', romanji: 'sa', row: 'sa-row', meaning: 'S+A音', difficulty: 2 },
        { kana: 'し', romanji: 'shi', row: 'sa-row', meaning: 'SH+I音', difficulty: 3 },
        { kana: 'す', romanji: 'su', row: 'sa-row', meaning: 'S+U音', difficulty: 2 },
        { kana: 'せ', romanji: 'se', row: 'sa-row', meaning: 'S+E音', difficulty: 2 },
        { kana: 'そ', romanji: 'so', row: 'sa-row', meaning: 'S+O音', difficulty: 2 },
        
        // た行
        { kana: 'た', romanji: 'ta', row: 'ta-row', meaning: 'T+A音', difficulty: 2 },
        { kana: 'ち', romanji: 'chi', row: 'ta-row', meaning: 'CH+I音', difficulty: 3 },
        { kana: 'つ', romanji: 'tsu', row: 'ta-row', meaning: 'TS+U音', difficulty: 3 },
        { kana: 'て', romanji: 'te', row: 'ta-row', meaning: 'T+E音', difficulty: 2 },
        { kana: 'と', romanji: 'to', row: 'ta-row', meaning: 'T+O音', difficulty: 2 },
        
        // な行
        { kana: 'な', romanji: 'na', row: 'na-row', meaning: 'N+A音', difficulty: 2 },
        { kana: 'に', romanji: 'ni', row: 'na-row', meaning: 'N+I音', difficulty: 2 },
        { kana: 'ぬ', romanji: 'nu', row: 'na-row', meaning: 'N+U音', difficulty: 2 },
        { kana: 'ね', romanji: 'ne', row: 'na-row', meaning: 'N+E音', difficulty: 2 },
        { kana: 'の', romanji: 'no', row: 'na-row', meaning: 'N+O音', difficulty: 1 },
        
        // は行
        { kana: 'は', romanji: 'ha', row: 'ha-row', meaning: 'H+A音', difficulty: 2 },
        { kana: 'ひ', romanji: 'hi', row: 'ha-row', meaning: 'H+I音', difficulty: 2 },
        { kana: 'ふ', romanji: 'fu', row: 'ha-row', meaning: 'F+U音', difficulty: 3 },
        { kana: 'へ', romanji: 'he', row: 'ha-row', meaning: 'H+E音', difficulty: 2 },
        { kana: 'ほ', romanji: 'ho', row: 'ha-row', meaning: 'H+O音', difficulty: 2 },
        
        // ま行
        { kana: 'ま', romanji: 'ma', row: 'ma-row', meaning: 'M+A音', difficulty: 2 },
        { kana: 'み', romanji: 'mi', row: 'ma-row', meaning: 'M+I音', difficulty: 2 },
        { kana: 'む', romanji: 'mu', row: 'ma-row', meaning: 'M+U音', difficulty: 2 },
        { kana: 'め', romanji: 'me', row: 'ma-row', meaning: 'M+E音', difficulty: 2 },
        { kana: 'も', romanji: 'mo', row: 'ma-row', meaning: 'M+O音', difficulty: 2 },
        
        // や行
        { kana: 'や', romanji: 'ya', row: 'ya-row', meaning: 'Y+A音', difficulty: 2 },
        { kana: 'ゆ', romanji: 'yu', row: 'ya-row', meaning: 'Y+U音', difficulty: 2 },
        { kana: 'よ', romanji: 'yo', row: 'ya-row', meaning: 'Y+O音', difficulty: 2 },
        
        // ら行
        { kana: 'ら', romanji: 'ra', row: 'ra-row', meaning: 'R+A音', difficulty: 3 },
        { kana: 'り', romanji: 'ri', row: 'ra-row', meaning: 'R+I音', difficulty: 3 },
        { kana: 'る', romanji: 'ru', row: 'ra-row', meaning: 'R+U音', difficulty: 3 },
        { kana: 'れ', romanji: 're', row: 'ra-row', meaning: 'R+E音', difficulty: 3 },
        { kana: 'ろ', romanji: 'ro', row: 'ra-row', meaning: 'R+O音', difficulty: 3 },
        
        // わ行
        { kana: 'わ', romanji: 'wa', row: 'wa-row', meaning: 'W+A音', difficulty: 2 },
        { kana: 'ゐ', romanji: 'wi', row: 'wa-row', meaning: 'W+I音(古语)', difficulty: 4 },
        { kana: 'ゑ', romanji: 'we', row: 'wa-row', meaning: 'W+E音(古语)', difficulty: 4 },
        { kana: 'を', romanji: 'wo', row: 'wa-row', meaning: 'W+O音', difficulty: 3 },
        
        // ん
        { kana: 'ん', romanji: 'n', row: 'n-row', meaning: '鼻音N', difficulty: 2 }
    ],
    
    // 片假名数据
    katakana: [
        // ア行
        { kana: 'ア', romanji: 'a', row: 'a-row', meaning: '元音A', difficulty: 1 },
        { kana: 'イ', romanji: 'i', row: 'a-row', meaning: '元音I', difficulty: 1 },
        { kana: 'ウ', romanji: 'u', row: 'a-row', meaning: '元音U', difficulty: 1 },
        { kana: 'エ', romanji: 'e', row: 'a-row', meaning: '元音E', difficulty: 1 },
        { kana: 'オ', romanji: 'o', row: 'a-row', meaning: '元音O', difficulty: 1 },
        
        // カ行
        { kana: 'カ', romanji: 'ka', row: 'ka-row', meaning: 'K+A音', difficulty: 2 },
        { kana: 'キ', romanji: 'ki', row: 'ka-row', meaning: 'K+I音', difficulty: 2 },
        { kana: 'ク', romanji: 'ku', row: 'ka-row', meaning: 'K+U音', difficulty: 2 },
        { kana: 'ケ', romanji: 'ke', row: 'ka-row', meaning: 'K+E音', difficulty: 2 },
        { kana: 'コ', romanji: 'ko', row: 'ka-row', meaning: 'K+O音', difficulty: 2 },
        
        // サ行
        { kana: 'サ', romanji: 'sa', row: 'sa-row', meaning: 'S+A音', difficulty: 2 },
        { kana: 'シ', romanji: 'shi', row: 'sa-row', meaning: 'SH+I音', difficulty: 3 },
        { kana: 'ス', romanji: 'su', row: 'sa-row', meaning: 'S+U音', difficulty: 2 },
        { kana: 'セ', romanji: 'se', row: 'sa-row', meaning: 'S+E音', difficulty: 2 },
        { kana: 'ソ', romanji: 'so', row: 'sa-row', meaning: 'S+O音', difficulty: 2 },
        
        // タ行
        { kana: 'タ', romanji: 'ta', row: 'ta-row', meaning: 'T+A音', difficulty: 2 },
        { kana: 'チ', romanji: 'chi', row: 'ta-row', meaning: 'CH+I音', difficulty: 3 },
        { kana: 'ツ', romanji: 'tsu', row: 'ta-row', meaning: 'TS+U音', difficulty: 3 },
        { kana: 'テ', romanji: 'te', row: 'ta-row', meaning: 'T+E音', difficulty: 2 },
        { kana: 'ト', romanji: 'to', row: 'ta-row', meaning: 'T+O音', difficulty: 2 },
        
        // ナ行
        { kana: 'ナ', romanji: 'na', row: 'na-row', meaning: 'N+A音', difficulty: 2 },
        { kana: 'ニ', romanji: 'ni', row: 'na-row', meaning: 'N+I音', difficulty: 2 },
        { kana: 'ヌ', romanji: 'nu', row: 'na-row', meaning: 'N+U音', difficulty: 2 },
        { kana: 'ネ', romanji: 'ne', row: 'na-row', meaning: 'N+E音', difficulty: 2 },
        { kana: 'ノ', romanji: 'no', row: 'na-row', meaning: 'N+O音', difficulty: 1 },
        
        // ハ行
        { kana: 'ハ', romanji: 'ha', row: 'ha-row', meaning: 'H+A音', difficulty: 2 },
        { kana: 'ヒ', romanji: 'hi', row: 'ha-row', meaning: 'H+I音', difficulty: 2 },
        { kana: 'フ', romanji: 'fu', row: 'ha-row', meaning: 'F+U音', difficulty: 3 },
        { kana: 'ヘ', romanji: 'he', row: 'ha-row', meaning: 'H+E音', difficulty: 2 },
        { kana: 'ホ', romanji: 'ho', row: 'ha-row', meaning: 'H+O音', difficulty: 2 },
        
        // マ行
        { kana: 'マ', romanji: 'ma', row: 'ma-row', meaning: 'M+A音', difficulty: 2 },
        { kana: 'ミ', romanji: 'mi', row: 'ma-row', meaning: 'M+I音', difficulty: 2 },
        { kana: 'ム', romanji: 'mu', row: 'ma-row', meaning: 'M+U音', difficulty: 2 },
        { kana: 'メ', romanji: 'me', row: 'ma-row', meaning: 'M+E音', difficulty: 2 },
        { kana: 'モ', romanji: 'mo', row: 'ma-row', meaning: 'M+O音', difficulty: 2 },
        
        // ヤ行
        { kana: 'ヤ', romanji: 'ya', row: 'ya-row', meaning: 'Y+A音', difficulty: 2 },
        { kana: 'ユ', romanji: 'yu', row: 'ya-row', meaning: 'Y+U音', difficulty: 2 },
        { kana: 'ヨ', romanji: 'yo', row: 'ya-row', meaning: 'Y+O音', difficulty: 2 },
        
        // ラ行
        { kana: 'ラ', romanji: 'ra', row: 'ra-row', meaning: 'R+A音', difficulty: 3 },
        { kana: 'リ', romanji: 'ri', row: 'ra-row', meaning: 'R+I音', difficulty: 3 },
        { kana: 'ル', romanji: 'ru', row: 'ra-row', meaning: 'R+U音', difficulty: 3 },
        { kana: 'レ', romanji: 're', row: 'ra-row', meaning: 'R+E音', difficulty: 3 },
        { kana: 'ロ', romanji: 'ro', row: 'ra-row', meaning: 'R+O音', difficulty: 3 },
        
        // ワ行
        { kana: 'ワ', romanji: 'wa', row: 'wa-row', meaning: 'W+A音', difficulty: 2 },
        { kana: 'ヰ', romanji: 'wi', row: 'wa-row', meaning: 'W+I音(古语)', difficulty: 4 },
        { kana: 'ヱ', romanji: 'we', row: 'wa-row', meaning: 'W+E音(古语)', difficulty: 4 },
        { kana: 'ヲ', romanji: 'wo', row: 'wa-row', meaning: 'W+O音', difficulty: 3 },
        
        // ン
        { kana: 'ン', romanji: 'n', row: 'n-row', meaning: '鼻音N', difficulty: 2 }
    ]
};

// 五十音表格布局（不包括古语字符）
const kanaGrid = [
    ['あ', 'い', 'う', 'え', 'お'],
    ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'],
    ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'],
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'],
    ['や', '', 'ゆ', '', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'],
    ['わ', '', '', '', 'を'],
    ['ん', '', '', '', '']
];

const katakanaGrid = [
    ['ア', 'イ', 'ウ', 'エ', 'オ'],
    ['カ', 'キ', 'ク', 'ケ', 'コ'],
    ['サ', 'シ', 'ス', 'セ', 'ソ'],
    ['タ', 'チ', 'ツ', 'テ', 'ト'],
    ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
    ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
    ['マ', 'ミ', 'ム', 'メ', 'モ'],
    ['ヤ', '', 'ユ', '', 'ヨ'],
    ['ラ', 'リ', 'ル', 'レ', 'ロ'],
    ['ワ', '', '', '', 'ヲ'],
    ['ン', '', '', '', '']
];

// 行名称
const rowNames = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ', 'ん'];
const katakanaRowNames = ['ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ', 'ン'];

// 列名称
const columnNames = ['', 'i', 'u', 'e', 'o'];

// 获取假名数据
function getKanaData(script = 'hiragana') {
    return kanaData[script];
}

// 根据假名获取数据
function getKanaInfo(kana, script = 'hiragana') {
    return kanaData[script].find(item => item.kana === kana);
}

// 根据行获取假名
function getKanaByRow(row, script = 'hiragana') {
    return kanaData[script].filter(item => item.row === row);
}

// 获取随机假名
function getRandomKana(script = 'hiragana', excludeAncient = true) {
    let data = kanaData[script];
    if (excludeAncient) {
        data = data.filter(item => item.difficulty < 4);
    }
    return data[Math.floor(Math.random() * data.length)];
}

// 获取多个随机假名（不重复）
function getRandomKanas(count, script = 'hiragana', excludeAncient = true) {
    let data = kanaData[script];
    if (excludeAncient) {
        data = data.filter(item => item.difficulty < 4);
    }
    
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 获取相似假名（用于生成干扰选项）
function getSimilarKanas(targetKana, script = 'hiragana', count = 3) {
    const target = getKanaInfo(targetKana, script);
    if (!target) return [];

    let data = kanaData[script].filter(item =>
        item.kana !== targetKana &&
        item.difficulty < 4 &&
        (item.row === target.row || Math.abs(item.difficulty - target.difficulty) <= 1)
    );

    // 如果相似的不够，就随机选择
    if (data.length < count) {
        const remaining = kanaData[script].filter(item =>
            item.kana !== targetKana &&
            item.difficulty < 4 &&
            !data.includes(item)
        );
        data = [...data, ...remaining];
    }

    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 获取对应的另一种文字（平假名<->片假名）
function getCorrespondingKana(kana, currentScript, targetScript) {
    const kanaInfo = getKanaInfo(kana, currentScript);
    if (!kanaInfo) return null;

    // 根据romanji找到对应的另一种文字
    const correspondingInfo = kanaData[targetScript].find(item =>
        item.romanji === kanaInfo.romanji && item.row === kanaInfo.row
    );

    return correspondingInfo ? correspondingInfo.kana : null;
}