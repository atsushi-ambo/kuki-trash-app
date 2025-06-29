// Test script for voice region functionality
// This simulates the voice recognition flow to validate region information usage

const fs = require('fs');
const path = require('path');

// Load region data
function loadRegionData() {
    try {
        const regionDataContent = fs.readFileSync(path.join(__dirname, 'regionData.js'), 'utf8');
        // Extract the regionData object from the file
        const match = regionDataContent.match(/const regionData = ({[\s\S]*?});/);
        if (match) {
            return eval('(' + match[1] + ')');
        }
    } catch (error) {
        console.error('Error loading region data:', error);
    }
    return null;
}

// Test function to simulate handleCollectionQuery
function testHandleCollectionQuery(query, userRegion, regionData) {
    console.log('=== handleCollectionQuery テスト開始 ===');
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
    
    // Simple collection day check (simplified version)
    const todaysCollections = [];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const targetDayName = dayNames[targetDate.getDay()];
    
    console.log('対象曜日:', targetDayName);
    
    Object.entries(regionInfo.schedule).forEach(([garbageType, schedule]) => {
        console.log(`チェック中: ${garbageType}, スケジュール:`, schedule.days);
        
        // Simplified check - just look for the day name in the schedule
        const hasMatchingDay = schedule.days.some(day => day.includes(targetDayName));
        if (hasMatchingDay) {
            console.log(`収集対象: ${garbageType}`);
            todaysCollections.push(garbageType);
        }
    });
    
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

// Main test function
function runTests() {
    console.log('🧪 音声認識地域機能テスト開始\n');
    
    const regionData = loadRegionData();
    if (!regionData) {
        console.error('❌ 地域データを読み込めませんでした');
        return;
    }
    
    console.log('✅ 地域データ読み込み成功');
    console.log('利用可能な地域数:', Object.keys(regionData).length);
    console.log('利用可能な地域:', Object.keys(regionData).join(', '), '\n');
    
    // Test different regions and queries
    const testCases = [
        { region: 'kuki-d', query: '今日のゴミは何？', description: '久喜地区Dブロック - 今日の収集' },
        { region: 'kuki-d', query: '明日のゴミはなんですか？', description: '久喜地区Dブロック - 明日の収集' },
        { region: 'washinomiya-a', query: '今日のゴミは何？', description: '鷲宮地区Aブロック - 今日の収集' },
        { region: 'shobu-a', query: '今日のゴミは何？', description: '菖蒲地区Aブロック - 今日の収集' }
    ];
    
    testCases.forEach((testCase, index) => {
        console.log(`\n📍 テストケース ${index + 1}: ${testCase.description}`);
        console.log('=' .repeat(50));
        
        const result = testHandleCollectionQuery(testCase.query, testCase.region, regionData);
        
        // Check if region name is included in the result
        const regionName = regionData[testCase.region]?.name;
        if (regionName && result.includes(regionName)) {
            console.log('✅ 地域名が結果に含まれています');
        } else {
            console.log('❌ 地域名が結果に含まれていません');
        }
        
        console.log('テスト結果:', result);
    });
    
    console.log('\n🎉 テスト完了！');
    console.log('\n📋 確認ポイント:');
    console.log('1. 地域データが正しく読み込まれているか');
    console.log('2. クエリに応じて正しい地域が参照されているか');
    console.log('3. 結果に地域名が含まれているか');
    console.log('4. 収集日判定が動作しているか');
}

// Run tests
runTests();
