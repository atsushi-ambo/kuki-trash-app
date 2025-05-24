// アプリケーションの状態管理
let isListening = false;
let recognition = null;
let currentAudio = null;
let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
let userRegion = localStorage.getItem('userRegion') || 'kuki-d'; // デフォルトは久喜地区Dブロック

// DOM要素の取得
const voiceButton = document.getElementById('voiceButton');
const itemInput = document.getElementById('itemInput');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const permissionModal = document.getElementById('permissionModal');

// 音声認識の初期化
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showStatus('お使いのブラウザは音声認識に対応していません。', 'error');
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        isListening = true;
        voiceButton.classList.add('listening');
        voiceButton.innerHTML = '🎙️';
        showStatus('音声を聞いています...', 'success');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('=== 音声認識結果処理開始 ===');
        console.log('認識結果:', transcript);
        console.log('現在のuserRegion:', userRegion);
        console.log('地域情報:', regionData[userRegion] ? regionData[userRegion].name : '未設定');
        
        // 自然な質問形式を検索クエリに変換
        const processedQuery = processVoiceInput(transcript);
        console.log('処理後のクエリ:', processedQuery);
        itemInput.value = processedQuery;
        
        showStatus(`「${transcript}」と認識しました`, 'success');
        
        // 自動で検索実行
        setTimeout(() => {
            console.log('検索実行開始...');
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

    // マイク許可確認
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            stream.getTracks().forEach(track => track.stop());
            recognition.start();
        })
        .catch(function(err) {
            showPermissionModal();
        });
}

// 音声ボタンのリセット
function resetVoiceButton() {
    isListening = false;
    voiceButton.classList.remove('listening');
    voiceButton.innerHTML = '🎤';
}

// マイク許可モーダル表示
function showPermissionModal() {
    permissionModal.style.display = 'flex';
}

// マイク許可
function allowMicrophone() {
    permissionModal.style.display = 'none';
    // 再度マイク許可を求める
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            stream.getTracks().forEach(track => track.stop());
            showStatus('マイクが許可されました。もう一度音声ボタンを押してください。', 'success');
        })
        .catch(function(err) {
            showStatus('マイクの許可が必要です。ブラウザの設定を確認してください。', 'error');
        });
}

// マイク拒否
function denyMicrophone() {
    permissionModal.style.display = 'none';
    showStatus('音声認識を使用するにはマイクの許可が必要です。', 'error');
}

// キーボード入力処理
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchItem();
    }
}

// クイック検索
function quickSearch(item) {
    itemInput.value = item;
    searchItem();
}

// ゴミ検索メイン関数
function searchItem() {
    const query = itemInput.value.trim().toLowerCase();
    
    console.log('=== searchItem 開始 ===');
    console.log('検索クエリ:', query);
    console.log('現在のuserRegion:', userRegion);
    
    if (!query) {
        showStatus('検索したいゴミの名前を入力してください。', 'error');
        return;
    }

    showStatus('検索中...', 'success');
    
    // 収集日クエリかどうかチェック
    if (query.includes('今日') || query.includes('明日') || query.includes('収集')) {
        console.log('収集日クエリとして処理');
        const collectionInfo = handleCollectionQuery(query);
        showStatus(collectionInfo, 'success');
        speakText(collectionInfo);
        updateRecentSearches(query);
        return;
    }
    
    // 通常のゴミ分別検索実行
    console.log('通常の分別検索として処理');
    const result = findGarbageCategory(query);
    
    if (result) {
        displayResult(result);
        speakResult(result);
        updateRecentSearches(query); // 最近の検索に追加
    } else {
        const noResultMessage = `「${query}」の分別方法が見つかりませんでした。久喜市役所にお問い合わせください。`;
        showStatus(noResultMessage, 'error');
        speakText(noResultMessage);
    }
}

// ゴミ分別検索ロジック
function findGarbageCategory(query) {
    // 1. 完全一致検索
    for (const [category, data] of Object.entries(garbageDatabase)) {
        if (data.items.some(item => item.toLowerCase() === query)) {
            return { category, data, item: query };
        }
    }

    // 2. 部分一致検索
    for (const [category, data] of Object.entries(garbageDatabase)) {
        const matchedItem = data.items.find(item => 
            item.toLowerCase().includes(query) || query.includes(item.toLowerCase())
        );
        if (matchedItem) {
            return { category, data, item: matchedItem };
        }
    }

    // 3. キーワードマッピング検索
    for (const [keyword, categories] of Object.entries(keywordMapping)) {
        if (query.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(query)) {
            // 最初にマッチしたカテゴリを返す
            const category = categories[0];
            if (garbageDatabase[category]) {
                return { category, data: garbageDatabase[category], item: keyword };
            }
        }
    }

    // 4. 発音類似検索
    for (const [standardTerm, variations] of Object.entries(pronunciationMapping)) {
        if (variations.some(variation => 
            query.includes(variation.toLowerCase()) || variation.toLowerCase().includes(query)
        )) {
            return findGarbageCategory(standardTerm.toLowerCase());
        }
    }

    return null;
}

// 検索結果表示
function displayResult(result) {
    const { category, data, item } = result;
    
    // 地域の収集スケジュールを取得
    const regionSchedule = getScheduleByRegion(userRegion, category);
    const regionInfo = regionData[userRegion];
    
    let collectionSchedule = data.collection; // デフォルトの収集情報
    let nextCollectionInfo = '';
    
    if (regionSchedule && regionInfo) {
        // 地域固有の収集スケジュールがある場合
        if (regionSchedule.days.includes('回収ボックス')) {
            collectionSchedule = `回収ボックス（${regionInfo.name}）`;
        } else {
            const daysList = regionSchedule.days.join('・');
            collectionSchedule = `${daysList} ${regionSchedule.time}〜（${regionInfo.name}）`;
            
            // 次回収集日を計算
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
    
    // 結果部分にスクロール
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ステータス表示
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    resultDiv.style.display = 'none';
}

// 音声読み上げ機能
function speakResult(result) {
    const { category, data, item } = result;
    
    // より自然な会話形式でのメッセージを生成
    let message = generateNaturalResponse(item, category, data);
    speakText(message);
}

// 自然な音声応答を生成
function generateNaturalResponse(item, category, data) {
    // 基本的な応答パターン
    const baseResponses = [
        `${item}は${category}ですね。`,
        `${item}については、${category}として処理してください。`,
        `${item}の分別方法をお答えします。${category}です。`
    ];
    
    // ランダムに基本応答を選択
    const baseResponse = baseResponses[Math.floor(Math.random() * baseResponses.length)];
    
    let message = baseResponse;
    
    // 出し方の説明を追加
    if (data.instructions) {
        message += ` ${data.instructions}`;
    }
    
    // 収集日の情報を追加
    if (data.collection) {
        message += ` 収集日は${data.collection}です。`;
    }
    
    // 注意事項がある場合は追加
    if (data.warning) {
        message += ` 注意事項として、${data.warning}`;
    }
    
    // 会話を続けるためのフレーズを追加
    const followUpPhrases = [
        ' 他にも何かお聞きになりたいことはありますか？',
        ' 他のゴミについても質問をどうぞ。',
        ' 何か他にもお困りのことがあれば、お聞かせください。'
    ];
    
    message += followUpPhrases[Math.floor(Math.random() * followUpPhrases.length)];
    
    return message;
}

function speakText(text) {
    // 既存の音声を停止
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    if ('speechSynthesis' in window) {
        // 既存の発話を停止
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // 日本語音声を設定
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => voice.lang.includes('ja'));
        if (japaneseVoice) {
            utterance.voice = japaneseVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }
}

// アプリケーション初期化
function initApp() {
    // Service Workerの登録（PWA対応）
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Service Worker登録成功:', registration.scope);
                })
                .catch(function(error) {
                    console.log('Service Worker登録失敗:', error);
                });
        });
    }

    // 音声合成の初期化（一部のブラウザで必要）
    if ('speechSynthesis' in window) {
        // 音声リストの読み込みを促す
        window.speechSynthesis.getVoices();
        
        // 音声リストが変更された時の処理
        window.speechSynthesis.onvoiceschanged = function() {
            console.log('音声リストが更新されました');
        };
    }

    // 音声認識の初期化
    initSpeechRecognition();
    
    // 地域機能の初期化
    initializeRegion();
    
    // 今日の収集情報表示
    displayTodaysCollection();
    
    // 収集カレンダー表示
    displayCollectionCalendar();
    
    // PWAインストールプロンプトの処理
    setupPWAInstall();
    
    console.log('久喜市ゴミ分別アプリが初期化されました');
}

// ページ読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', initApp);

// ユーティリティ関数：デバッグ用
function debugSearchDatabase(query) {
    console.log(`検索クエリ: "${query}"`);
    const result = findGarbageCategory(query.toLowerCase());
    if (result) {
        console.log('検索結果:', result);
    } else {
        console.log('該当するゴミ分別が見つかりませんでした');
    }
    return result;
}

// 全ゴミアイテムの一覧取得（デバッグ用）
function getAllGarbageItems() {
    const allItems = [];
    Object.entries(garbageDatabase).forEach(([category, data]) => {
        data.items.forEach(item => {
            allItems.push({ item, category });
        });
    });
    return allItems;
}

// エクスポート（必要に応じて）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findGarbageCategory,
        garbageDatabase,
        keywordMapping,
        pronunciationMapping
    };
}

// PWAインストール機能
let deferredPrompt;

function setupPWAInstall() {
    // PWAインストールプロンプトの取得
    window.addEventListener('beforeinstallprompt', (e) => {
        // デフォルトのミニインフォバーを非表示
        e.preventDefault();
        // 後で使用するためにイベントを保存
        deferredPrompt = e;
        // インストールボタンを表示
        showInstallButton();
    });

    // PWAインストール完了時
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWAがインストールされました');
        hideInstallButton();
    });
}

function showInstallButton() {
    // インストールボタンを動的に作成
    if (!document.getElementById('installButton')) {
        const installButton = document.createElement('button');
        installButton.id = 'installButton';
        installButton.className = 'install-button';
        installButton.innerHTML = '📱 アプリをインストール';
        installButton.onclick = installPWA;
        
        // ボタンをコンテナの最後に追加
        const container = document.querySelector('.container');
        container.appendChild(installButton);
    }
}

function hideInstallButton() {
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.remove();
    }
}

function installPWA() {
    if (deferredPrompt) {
        // インストールプロンプトを表示
        deferredPrompt.prompt();
        
        // ユーザーの選択を待つ
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('ユーザーがPWAインストールを承認しました');
            } else {
                console.log('ユーザーがPWAインストールを拒否しました');
            }
            deferredPrompt = null;
        });
    }
}

// 最近の検索履歴の更新
function updateRecentSearches(query) {
    // 既に存在する場合は削除
    recentSearches = recentSearches.filter(item => item !== query);
    
    // 新しい検索を先頭に追加
    recentSearches.unshift(query);
    
    // 最大5件まで保持
    if (recentSearches.length > 5) {
        recentSearches.pop();
    }
    
    // ローカルストレージに保存
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

// コレクションカレンダーの表示
function displayCollectionCalendar() {
    const calendarDiv = document.getElementById('collectionCalendar');
    if (!calendarDiv) return;
    
    calendarDiv.innerHTML = '';
    
    const regionInfo = regionData[userRegion];
    if (!regionInfo) {
        calendarDiv.innerHTML = '<p>地域情報が設定されていません</p>';
        return;
    }
    
    // カレンダーのヘッダー
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
        <div class="header-item">日付</div>
        <div class="header-item">曜日</div>
        <div class="header-item">収集内容</div>
    `;
    calendarDiv.appendChild(header);
    
    // 今日から14日間の収集スケジュールを表示
    const today = new Date();
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    
    for (let i = 0; i < 14; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const dayOfWeek = checkDate.getDay();
        const dayName = dayNames[dayOfWeek];
        
        const dayCollections = [];
        
        // 各ゴミ種別の収集日をチェック
        Object.entries(regionInfo.schedule).forEach(([garbageType, schedule]) => {
            if (schedule.days.includes('回収ボックス')) {
                return; // 回収ボックスはスキップ
            }
            
            // 通常の曜日チェック
            if (schedule.days.includes(dayName)) {
                dayCollections.push(garbageType);
                return;
            }
            
            // 第X週チェック
            for (const scheduleDay of schedule.days) {
                if (scheduleDay.includes('第') && scheduleDay.includes(dayName)) {
                    const weekNumber = Math.ceil(checkDate.getDate() / 7);
                    const requiredWeek = parseInt(scheduleDay.match(/第(\d+)/)[1]);
                    
                    if (weekNumber === requiredWeek) {
                        dayCollections.push(garbageType);
                        break;
                    }
                }
            }
        });
        
        const content = dayCollections.length > 0 ? dayCollections.join('・') : '-';
        const isToday = i === 0;
        
        const row = document.createElement('div');
        row.className = `calendar-row ${isToday ? 'today' : ''}`;
        row.innerHTML = `
            <div class="row-item">${(checkDate.getMonth() + 1)}/${checkDate.getDate()}</div>
            <div class="row-item">${dayName}</div>
            <div class="row-item">${content}</div>
        `;
        calendarDiv.appendChild(row);
    }
}

// 最近の検索履歴を管理
function addToRecentSearches(item) {
    if (!recentSearches.includes(item)) {
        recentSearches.unshift(item);
        recentSearches = recentSearches.slice(0, 5); // 最新5件まで保持
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        updateRecentSearchesDisplay();
    }
}

function updateRecentSearchesDisplay() {
    const recentContainer = document.getElementById('recentSearches');
    if (!recentContainer) return;
    
    if (recentSearches.length === 0) {
        recentContainer.style.display = 'none';
        return;
    }
    
    recentContainer.style.display = 'block';
    recentContainer.innerHTML = `
        <h3>最近の検索</h3>
        <div class="recent-buttons">
            ${recentSearches.map(item => 
                `<button class="recent-button" onclick="quickSearch('${item}')">${item}</button>`
            ).join('')}
        </div>
    `;
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
    
    // 各ゴミ種別の収集日をチェック（統一されたisCollectionDay関数を使用）
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

// 検索の改善版
function searchItemEnhanced(searchTerm = null) {
    const query = searchTerm || itemInput.value.trim();
    
    if (!query) {
        showStatus('検索するゴミの名前を入力してください', 'error');
        return;
    }

    // ローディング状態を表示
    showStatus('検索中...', 'info');
    
    // 検索を少し遅延させてローディング効果を見せる
    setTimeout(() => {
        const result = findGarbageCategory(query);
        
        if (result) {
            addToRecentSearches(query);
            displayResult(result);
            speakResult(result);
        } else {
            const notFoundMessage = `「${query}」の分別方法が見つかりませんでした。久喜市のゴミ分別ルールを確認するか、より具体的な名前で検索してください。`;
            showStatus(notFoundMessage, 'error');
            speakText(notFoundMessage);
        }
    }, 500);
}

// 初期化関数
function initializeApp() {
    // 音声認識の初期化
    initSpeechRecognition();
    
    // 地域の初期化
    initializeRegion();
    
    // 最近の検索履歴を表示
    displayRecentSearches();
    
    // コレクションカレンダーを表示
    displayCollectionCalendar();
    
    // Service Worker登録
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    // PWAインストールボタンの制御
    let deferredPrompt;
    const installButton = document.getElementById('installButton');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installButton) {
            installButton.style.display = 'block';
        }
    });
    
    if (installButton) {
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                        installButton.style.display = 'none';
                    }
                    deferredPrompt = null;
                });
            }
        });
    }
}

// 地域管理機能
function initializeRegion() {
    console.log('地域初期化を開始:', userRegion);
    
    // regionDataが読み込まれているかチェック
    if (typeof regionData === 'undefined') {
        console.error('regionData.jsが読み込まれていません');
        return;
    }
    
    console.log('利用可能な地域:', Object.keys(regionData));
    
    const regionInfo = regionData[userRegion];
    if (regionInfo) {
        console.log('現在の地域情報:', regionInfo);
        updateCurrentRegionDisplay();
        populateRegionSelect();
    } else {
        console.warn('地域情報が見つかりません:', userRegion);
        // デフォルト地域を設定
        userRegion = 'kuki-d';
        localStorage.setItem('userRegion', userRegion);
        console.log('デフォルト地域に設定:', userRegion);
        
        const defaultRegionInfo = regionData[userRegion];
        if (defaultRegionInfo) {
            updateCurrentRegionDisplay();
            populateRegionSelect();
        }
    }
}

function updateCurrentRegionDisplay() {
    const currentRegionSpan = document.getElementById('currentRegion');
    const regionInfo = regionData[userRegion];
    if (currentRegionSpan && regionInfo) {
        currentRegionSpan.textContent = regionInfo.name;
    }
}

function populateRegionSelect() {
    console.log('地域選択リストを作成中...');
    const regionSelect = document.getElementById('regionSelect');
    if (!regionSelect) {
        console.error('regionSelectエレメントが見つかりません');
        return;
    }
    
    regionSelect.innerHTML = '<option value="">地域を選択してください</option>';
    
    // regionDataが利用可能かチェック
    if (typeof regionData === 'undefined') {
        console.error('regionDataが利用できません');
        return;
    }
    
    // 地域別にグループ化
    const regions = getAllRegions();
    console.log('取得した地域リスト:', regions);
    
    const groups = {
        '久喜地区': [],
        '菖蒲地区': [],
        '鷲宮地区': [],
        '栗橋地区': []
    };
    
    regions.forEach(region => {
        if (region.id.startsWith('kuki-')) groups['久喜地区'].push(region);
        else if (region.id.startsWith('shobu-')) groups['菖蒲地区'].push(region);
        else if (region.id.startsWith('washinomiya-')) groups['鷲宮地区'].push(region);
        else if (region.id.startsWith('kurihashi-')) groups['栗橋地区'].push(region);
    });
    
    Object.entries(groups).forEach(([groupName, groupRegions]) => {
        if (groupRegions.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupName;
            
            groupRegions.forEach(region => {
                const option = document.createElement('option');
                option.value = region.id;
                option.textContent = region.name;
                if (region.id === userRegion) {
                    option.selected = true;
                }
                optgroup.appendChild(option);
            });
            
            regionSelect.appendChild(optgroup);
        }
    });
}

function changeRegion() {
    const regionSelect = document.getElementById('regionSelect');
    const newRegion = regionSelect.value;
    
    if (newRegion && newRegion !== userRegion) {
        userRegion = newRegion;
        localStorage.setItem('userRegion', userRegion);
        updateCurrentRegionDisplay();
        
        // 地域変更の通知
        showStatus(`地域を${regionData[userRegion].name}に変更しました`, 'success');
        
        // 今日の収集情報を更新
        displayTodaysCollection();
        
        // 収集カレンダーを更新
        displayCollectionCalendar();
    }
    
    // モーダルを閉じる
    closeRegionModal();
}

function openRegionModal() {
    const modal = document.getElementById('regionModal');
    if (modal) {
        populateRegionSelect();
        modal.style.display = 'block';
    }
}

function closeRegionModal() {
    const modal = document.getElementById('regionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// HTMLから呼び出される地域選択関数
function showRegionSelector() {
    const regionSelector = document.getElementById('regionSelector');
    if (regionSelector) {
        populateRegionSelect();
        regionSelector.style.display = 'block';
    }
}

function setRegion() {
    const regionSelect = document.getElementById('regionSelect');
    if (regionSelect && regionSelect.value) {
        changeRegion(regionSelect.value);
    }
    cancelRegionSelection();
}

function cancelRegionSelection() {
    const regionSelector = document.getElementById('regionSelector');
    if (regionSelector) {
        regionSelector.style.display = 'none';
    }
}

// 音声入力を自然な質問形式から検索クエリに変換
function processVoiceInput(transcript) {
    console.log('音声入力を処理中:', transcript);
    
    // テキストを小文字に変換して処理しやすくする
    const input = transcript.toLowerCase();
    
    // 質問パターンを定義
    const questionPatterns = [
        // 「〇〇はなんですか？」「〇〇って何？」パターン
        {
            pattern: /(.+?)(?:は|って)(?:なん|何)(?:ですか|です|だ|？|\?)/,
            extract: (match) => match[1]
        },
        // 「〇〇の分別方法を教えて」パターン
        {
            pattern: /(.+?)(?:の)?(?:分別|分け方|出し方)(?:方法|を|は)?(?:教えて|について|知りたい)/,
            extract: (match) => match[1]
        },
        // 「〇〇はどうやって捨てる？」パターン
        {
            pattern: /(.+?)(?:は|を)?(?:どうやって|どう)?(?:捨て|処分|廃棄)(?:る|るの|ますか|ればいい)？?/,
            extract: (match) => match[1]
        },
        // 「〇〇の処分方法は？」パターン
        {
            pattern: /(.+?)(?:の)?(?:処分|廃棄)(?:方法|の仕方)(?:は|を|について)？?/,
            extract: (match) => match[1]
        },
        // 「〇〇について教えて」パターン
        {
            pattern: /(.+?)(?:について|に関して)(?:教えて|知りたい|聞きたい)/,
            extract: (match) => match[1]
        },
        // 今日・明日のゴミ収集パターン
        {
            pattern: /(今日|明日|きょう|あした)(?:の)?(?:ゴミ|ごみ|収集|回収)(?:は|について|何)/,
            extract: (match) => match[1] === '今日' || match[1] === 'きょう' ? '今日の収集' : '明日の収集'
        }
    ];
    
    // 各パターンをチェック
    for (const pattern of questionPatterns) {
        const match = input.match(pattern.pattern);
        if (match) {
            const extractedQuery = pattern.extract(match).trim();
            console.log('抽出されたクエリ:', extractedQuery);
            
            // 特殊なケース（収集日情報）の処理
            if (extractedQuery.includes('収集')) {
                return extractedQuery;
            }
            
            // 一般的なゴミアイテムの場合、不要な助詞を除去
            const cleanedQuery = extractedQuery
                .replace(/^(この|その|あの|どの)\s*/, '') // 指示語を除去
                .replace(/\s*(は|を|が|の|に|で|と)\s*$/, '') // 末尾の助詞を除去
                .trim();
            
            console.log('クリーンアップ後のクエリ:', cleanedQuery);
            return cleanedQuery;
        }
    }
    
    // パターンにマッチしない場合は、一般的なクリーンアップのみ実行
    const cleanedInput = input
        .replace(/(?:教えて|知りたい|聞きたい|について|に関して|ですか|です|だ|？|\?)$/g, '') // 質問の末尾表現を除去
        .replace(/^(この|その|あの|どの)\s*/, '') // 指示語を除去
        .replace(/\s*(は|を|が|の|に|で|と)\s*$/, '') // 末尾の助詞を除去
        .trim();
    
    console.log('最終的なクエリ:', cleanedInput || transcript);
    return cleanedInput || transcript;
}

// 収集日情報の処理
function handleCollectionQuery(query) {
    console.log('=== handleCollectionQuery 開始 ===');
    console.log('クエリ:', query);
    console.log('現在の地域:', userRegion);
    
    const regionInfo = regionData[userRegion];
    if (!regionInfo) {
        console.error('地域情報が見つかりません:', userRegion);
        return '地域情報が設定されていません。';
    }
    
    console.log('地域情報:', regionInfo.name);
    
    const today = new Date();
    let targetDate = new Date(today);
    
    if (query.includes('明日')) {
        targetDate.setDate(today.getDate() + 1);
    }
    
    console.log('対象日:', targetDate.toLocaleDateString('ja-JP'));
    
    // その日の収集予定を確認
    const todaysCollections = [];
    for (const [garbageType, schedule] of Object.entries(regionInfo.schedule)) {
        console.log(`チェック中: ${garbageType}, スケジュール:`, schedule.days);
        if (isCollectionDay(targetDate, schedule.days)) {
            console.log(`収集対象: ${garbageType}`);
            todaysCollections.push(garbageType);
        }
    }
    
    const dayText = query.includes('明日') ? '明日' : '今日';
    
    if (todaysCollections.length > 0) {
        const result = `${dayText}は${todaysCollections.join('、')}の収集日です。朝8時30分までに出してください。（${regionInfo.name}）`;
        console.log('結果:', result);
        return result;
    } else {
        const result = `${dayText}はゴミの収集日ではありません。（${regionInfo.name}）`;
        console.log('結果:', result);
        return result;
    }
}

// 収集日判定のヘルパー関数
function isCollectionDay(date, scheduleDays) {
    const dayOfWeek = date.getDay(); // 0: 日, 1: 月, ..., 6: 土
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const currentDay = dayNames[dayOfWeek];
    
    // 週の何回目かを計算（月の第何週か）
    const weekOfMonth = Math.ceil(date.getDate() / 7);
    
    for (const scheduleDay of scheduleDays) {
        console.log(`チェック中: ${scheduleDay}, 今日: ${currentDay}, 第${weekOfMonth}週`);
        
        // 回収ボックスは除外
        if (scheduleDay.includes('回収ボックス')) {
            continue;
        }
        
        // 通常の曜日（毎週）
        if (scheduleDay === currentDay) {
            console.log(`毎週${currentDay}にマッチ`);
            return true;
        }
        
        // 第N週の形式をチェック
        if (scheduleDay.includes('第') && scheduleDay.includes(currentDay)) {
            // 「第1火」「第2・第4火」などの形式を処理
            const weekPattern = scheduleDay.replace(currentDay, ''); // 曜日を除去
            
            // 複数週の場合（「第2・第4」など）
            if (weekPattern.includes('・')) {
                const weeks = weekPattern.split('・').map(w => w.replace('第', '').trim());
                for (const week of weeks) {
                    if (parseInt(week) === weekOfMonth) {
                        console.log(`第${week}${currentDay}にマッチ`);
                        return true;
                    }
                }
            } 
            // 単一週の場合（「第1」など）
            else {
                const week = weekPattern.replace('第', '').trim();
                if (parseInt(week) === weekOfMonth) {
                    console.log(`第${week}${currentDay}にマッチ`);
                    return true;
                }
            }
        }
    }
    
    return false;
}
