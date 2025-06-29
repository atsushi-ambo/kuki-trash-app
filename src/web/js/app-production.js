// 久喜市ゴミ分別アプリ - Production Version
// Production version with debug logs removed for optimal performance

let userRegion = localStorage.getItem('userRegion') || null;
let isListening = false;
let recognition = null;
let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

// DOM要素の取得
const itemInput = document.getElementById('itemInput');
const searchButton = document.getElementById('searchButton');
const voiceButton = document.getElementById('voiceButton');
const resultDiv = document.getElementById('result');
const statusDiv = document.getElementById('status');
const regionSelect = document.getElementById('regionSelect');
const currentRegionDisplay = document.getElementById('currentRegion');

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    if (regionSelect) {
        loadRegionOptions();
    }
    updateRegionDisplay();
    displayTodaysCollection();
    
    if (recentSearches.length > 0) {
        displayRecentSearches();
    }
    
    // 音声認識のブラウザサポートチェック
    checkSpeechRecognitionSupport();
});

// 地域選択肢の読み込み
function loadRegionOptions() {
    if (!regionData) return;
    
    regionSelect.innerHTML = '<option value="">地域を選択してください</option>';
    Object.keys(regionData).forEach(regionKey => {
        const option = document.createElement('option');
        option.value = regionKey;
        option.textContent = regionData[regionKey].name;
        if (regionKey === userRegion) {
            option.selected = true;
        }
        regionSelect.appendChild(option);
    });
}

// 地域変更処理
function changeRegion() {
    if (regionSelect && regionSelect.value) {
        userRegion = regionSelect.value;
        localStorage.setItem('userRegion', userRegion);
        updateRegionDisplay();
        displayTodaysCollection();
        showStatus(`地域を${regionData[userRegion].name}に変更しました`, 'success');
    }
}

// 現在の地域表示を更新
function updateRegionDisplay() {
    if (currentRegionDisplay) {
        if (userRegion && regionData[userRegion]) {
            currentRegionDisplay.textContent = regionData[userRegion].name;
        } else {
            currentRegionDisplay.textContent = '地域を選択してください';
        }
    }
}

// 音声認識サポートチェック
function checkSpeechRecognitionSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        if (voiceButton) {
            voiceButton.style.display = 'none';
            showStatus('お使いのブラウザは音声認識に対応していません', 'error');
        }
        return false;
    }
    return true;
}

// 音声認識の初期化
function initSpeechRecognition() {
    if (!checkSpeechRecognitionSupport()) {
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        
        if (itemInput) {
            itemInput.value = processVoiceInput(transcript);
        }
        
        showStatus(`音声認識: "${transcript}"`, 'success');
        
        setTimeout(() => {
            searchItem();
        }, 1000);
    };

    recognition.onerror = function(event) {
        let errorMessage = '音声認識でエラーが発生しました';
        
        switch(event.error) {
            case 'no-speech':
                errorMessage = '音声が検出されませんでした。もう一度お試しください。';
                break;
            case 'audio-capture':
                errorMessage = 'マイクにアクセスできません。設定を確認してください。';
                break;
            case 'not-allowed':
                errorMessage = 'マイクの使用が許可されていません。';
                break;
            case 'network':
                errorMessage = 'ネットワークエラーが発生しました。';
                break;
        }
        
        showStatus(errorMessage, 'error');
        resetVoiceButton();
    };

    recognition.onend = function() {
        resetVoiceButton();
    };

    return true;
}

// 音声認識開始
function startVoiceRecognition() {
    if (!recognition) {
        if (!initSpeechRecognition()) {
            return;
        }
    }

    if (isListening) {
        recognition.stop();
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            isListening = true;
            if (voiceButton) {
                voiceButton.textContent = '🔴 停止';
                voiceButton.classList.add('listening');
            }
            showStatus('音声を認識しています...', 'info');
            recognition.start();
        })
        .catch((error) => {
            showStatus('マイクへのアクセスが許可されていません', 'error');
        });
}

// 音声ボタンのリセット
function resetVoiceButton() {
    isListening = false;
    if (voiceButton) {
        voiceButton.textContent = '🎤 音声';
        voiceButton.classList.remove('listening');
    }
}

// ゴミ検索メイン関数
function searchItem() {
    const query = itemInput.value.trim().toLowerCase();
    
    if (!query) {
        showStatus('検索したいゴミの名前を入力してください。', 'error');
        return;
    }

    showStatus('検索中...', 'success');
    
    // 収集日クエリかどうかチェック
    if (query.includes('今日') || query.includes('明日') || query.includes('収集')) {
        const collectionInfo = handleCollectionQuery(query);
        showStatus(collectionInfo, 'success');
        speakText(collectionInfo);
        updateRecentSearches(query);
        return;
    }
    
    // 通常のゴミ分別検索実行
    const result = findGarbageCategory(query);
    
    if (result) {
        displayResult(result);
        speakResult(result);
        updateRecentSearches(query);
    } else {
        const noResultMessage = `「${query}」の分別方法が見つかりませんでした。久喜市役所にお問い合わせください。`;
        showStatus(noResultMessage, 'error');
        speakText(noResultMessage);
    }
}

// 音声入力を自然な質問形式から検索クエリに変換
function processVoiceInput(transcript) {
    if (transcript.includes('今日') || transcript.includes('明日') || transcript.includes('収集')) {
        return transcript;
    }
    
    let extractedQuery = transcript
        .replace(/の分別|分別方法|を教えて|ってなに|はなに|はどこ|どうやって|の捨て方|どうする/gi, '')
        .replace(/\?|？/g, '')
        .trim();
    
    if (extractedQuery) {
        const cleanedQuery = extractedQuery
            .replace(/^(この|その|あの|どの)\s*/, '')
            .replace(/\s*(は|を|が|の|に|で|と)\s*$/, '')
            .trim();
        
        return cleanedQuery;
    }
    
    return transcript;
}

// 検索結果表示
function displayResult(result) {
    const { category, data, item } = result;
    
    const regionSchedule = getScheduleByRegion(userRegion, category);
    const regionInfo = regionData[userRegion];
    
    let collectionSchedule = data.collection;
    let nextCollectionInfo = '';
    
    if (regionSchedule && regionInfo) {
        if (regionSchedule.days.includes('回収ボックス')) {
            collectionSchedule = `回収ボックス（${regionInfo.name}）`;
        } else {
            const daysList = regionSchedule.days.join('・');
            collectionSchedule = `${daysList} ${regionSchedule.time}〜（${regionInfo.name}）`;
            
            const nextDate = getNextCollectionDate(userRegion, category);
            if (nextDate) {
                nextCollectionInfo = `<div class="next-collection"><strong>📅 次回収集予定：</strong> ${formatDate(nextDate)}</div>`;
            }
        }
    }
    
    resultDiv.style.background = data.color;
    resultDiv.innerHTML = `
        <div class="category">${category}</div>
        <div class="category-info">
            <strong>🗑️ 出し方：</strong><br>
            ${data.instructions}
        </div>
        <div class="collection-info">
            <strong>📅 収集日：</strong><br>
            ${collectionSchedule}
        </div>
        ${nextCollectionInfo}
        ${data.warning ? `<div class="warning-info">⚠️ 注意：${data.warning}</div>` : ''}
    `;
    
    resultDiv.style.display = 'block';
    statusDiv.style.display = 'none';
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 最近の検索履歴の更新
function updateRecentSearches(query) {
    recentSearches = recentSearches.filter(item => item !== query);
    recentSearches.unshift(query);
    
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

// 最近の検索履歴の表示
function displayRecentSearches() {
    const recentSearchesDiv = document.getElementById('recentSearches');
    recentSearchesDiv.innerHTML = '';
    
    recentSearches.forEach(query => {
        const div = document.createElement('div');
        div.className = 'recent-search';
        div.textContent = query;
        div.onclick = () => {
            itemInput.value = query;
            searchItem();
        };
        recentSearchesDiv.appendChild(div);
    });
}

// ステータス表示
function showStatus(message, type = 'info') {
    if (!statusDiv) return;
    
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}

// 今日の収集情報を取得
function getTodaysCollection() {
    const today = new Date();
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const todayName = dayNames[today.getDay()];
    
    const regionInfo = regionData[userRegion];
    if (!regionInfo) {
        return '🎌 地域情報が設定されていません';
    }
    
    const todaysCollections = [];
    
    Object.entries(regionInfo.schedule).forEach(([garbageType, schedule]) => {
        if (isCollectionDay(today, schedule.days)) {
            todaysCollections.push(garbageType);
        }
    });
    
    if (todaysCollections.length === 0) {
        return `🎌 今日（${todayName}曜日）は${regionInfo.name}での収集はありません`;
    }
    
    const collectionList = todaysCollections.join('・');
    return `🗑️ 今日（${todayName}曜日）は${regionInfo.name}で【${collectionList}】の収集日です`;
}

// 収集情報を表示
function displayTodaysCollection() {
    const collectionDiv = document.getElementById('todaysCollection');
    if (collectionDiv) {
        collectionDiv.innerHTML = getTodaysCollection();
    }
}

// 収集日情報の処理
function handleCollectionQuery(query) {
    const regionInfo = regionData[userRegion];
    if (!regionInfo) {
        return '地域情報が設定されていません。';
    }
    
    const today = new Date();
    let targetDate = new Date(today);
    
    if (query.includes('明日')) {
        targetDate.setDate(today.getDate() + 1);
    }
    
    const todaysCollections = [];
    
    for (const [garbageType, schedule] of Object.entries(regionInfo.schedule)) {
        if (isCollectionDay(targetDate, schedule.days)) {
            todaysCollections.push(garbageType);
        }
    }
    
    const dayText = query.includes('明日') ? '明日' : '今日';
    
    if (todaysCollections.length > 0) {
        return `${dayText}は${todaysCollections.join('、')}の収集日です。朝8時30分までに出してください。（${regionInfo.name}）`;
    } else {
        return `${dayText}はゴミの収集日ではありません。（${regionInfo.name}）`;
    }
}

// 音声合成
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}

// 検索結果の音声読み上げ
function speakResult(result) {
    const { category, data } = result;
    const regionInfo = regionData[userRegion];
    const regionSchedule = getScheduleByRegion(userRegion, category);
    
    let collectionInfo = data.collection;
    if (regionSchedule && regionInfo) {
        if (regionSchedule.days.includes('回収ボックス')) {
            collectionInfo = `回収ボックスで随時回収`;
        } else {
            collectionInfo = `${regionSchedule.days.join('と')}に収集`;
        }
    }
    
    const message = `${category}です。${collectionInfo}。${data.instructions}`;
    speakText(message);
}

// イベントリスナーの設定
if (searchButton) {
    searchButton.addEventListener('click', searchItem);
}

if (voiceButton) {
    voiceButton.addEventListener('click', startVoiceRecognition);
}

if (itemInput) {
    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchItem();
        }
    });
}

if (regionSelect) {
    regionSelect.addEventListener('change', changeRegion);
}

// クイック検索機能
function quickSearch(query) {
    if (itemInput) {
        itemInput.value = query;
        searchItem();
    }
}

// Enterキーでの検索実行
function handleEnter(event) {
    if (event.key === 'Enter') {
        searchItem();
    }
}
