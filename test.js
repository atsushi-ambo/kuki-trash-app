// 久喜市ゴミ分別アプリのテスト
// Node.js環境での簡単なテスト

// テスト用のガベージデータ直接読み込み
const { garbageDatabase } = require('./garbageData.js');

// 検索関数を独自実装（テスト用）
function findGarbageCategory(searchItem) {
    const searchLower = searchItem.toLowerCase();
    
    for (const [category, data] of Object.entries(garbageDatabase)) {
        // 直接アイテム名での検索
        for (const item of data.items) {
            if (item.toLowerCase().includes(searchLower)) {
                return { category, data };
            }
        }
        
        // キーワードでの検索
        if (data.keywords) {
            for (const keyword of data.keywords) {
                if (keyword.toLowerCase().includes(searchLower) || 
                    searchLower.includes(keyword.toLowerCase())) {
                    return { category, data };
                }
            }
        }
    }
    
    return null;
}

function runTests() {
    console.log('🧪 久喜市ゴミ分別アプリのテスト開始\n');
    
    let passedTests = 0;
    let totalTests = 0;
    
    // テスト1: 基本的な検索テスト
    function test(name, searchTerm, expectedCategory) {
        totalTests++;
        const result = findGarbageCategory(searchTerm);
        
        if (result && result.category === expectedCategory) {
            console.log(`✅ ${name}: PASS`);
            passedTests++;
        } else {
            console.log(`❌ ${name}: FAIL`);
            console.log(`  検索語: "${searchTerm}"`);
            console.log(`  期待値: "${expectedCategory}"`);
            console.log(`  実際値: "${result ? result.category : 'null'}"`);
        }
    }
    
    // 基本的な検索テスト
    test('ペットボトル検索', 'ペットボトル', 'びん・缶・ペットボトル');
    test('空き缶検索', '空き缶', 'びん・缶・ペットボトル');
    test('新聞紙検索', '新聞紙', '新聞');
    test('生ゴミ検索', '生ゴミ', '燃やせるごみ');
    test('電池検索', '乾電池', '有害ごみ');
    test('テレビ検索', 'テレビ', '粗大ごみ');
    
    // 部分一致テスト
    test('アルミ缶検索', 'アルミ缶', 'びん・缶・ペットボトル');
    test('段ボール検索', 'ダンボール', '段ボール');
    test('プラスチック容器検索', 'プラスチック容器', '資源プラスチック類');
    
    // キーワードマッピングテスト
    test('缶検索', '缶', 'びん・缶・ペットボトル');
    test('紙検索', '紙', '雑誌・ざつがみ');
    test('プラスチック検索', 'プラスチック', '資源プラスチック類');
    
    // 存在しないアイテムのテスト
    totalTests++;
    const noResult = findGarbageCategory('存在しないゴミ');
    if (!noResult) {
        console.log('✅ 存在しないアイテム検索: PASS');
        passedTests++;
    } else {
        console.log('❌ 存在しないアイテム検索: FAIL');
    }
    
    console.log(`\n📊 テスト結果: ${passedTests}/${totalTests} 通過`);
    console.log(`成功率: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('🎉 すべてのテストが通過しました！');
    } else {
        console.log('⚠️ 一部のテストが失敗しました。');
    }
}

// データベース統計情報の表示
function showDatabaseStats() {
    console.log('\n📈 データベース統計:');
    
    let totalItems = 0;
    Object.entries(garbageDatabase).forEach(([category, data]) => {
        console.log(`  ${category}: ${data.items.length}項目`);
        totalItems += data.items.length;
    });
    
    console.log(`  合計: ${totalItems}項目`);
    console.log(`  カテゴリ数: ${Object.keys(garbageDatabase).length}`);
}

// Node.js環境でのみ実行
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    showDatabaseStats();
}

module.exports = {
    runTests,
    showDatabaseStats
};
